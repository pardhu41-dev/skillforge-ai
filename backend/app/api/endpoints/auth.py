import random
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.auth import (
    SendOTPRequest,
    SendOTPResponse,
    VerifyOTPRequest,
    VerifyOTPResponse,
    CompleteOnboardingRequest,
    StudentRegisterRequest,
    TokenResponse,
)
from app.core.security import create_access_token, decode_access_token
from app.mailer import send_otp_email

router = APIRouter()
security_scheme = HTTPBearer(auto_error=False)

logger = logging.getLogger("uvicorn")

# In-memory OTP storage: email -> { "otp": str, "expires_at": datetime }
otp_store: Dict[str, Dict[str, Any]] = {}

# Temp tokens for unregistered users going through onboarding
temp_token_store: Dict[str, str] = {}  # temp_token -> email

# In-memory student database
students_db: Dict[str, Dict[str, Any]] = {
    "saradhi@skillforge.ai": {
        "id": 1,
        "email": "saradhi@skillforge.ai",
        "name": "G. P. P. Saradhi",
        "full_name": "G. P. P. Saradhi",
        "college": "KL University",
        "branch": "B.Tech AI & Data Science",
        "semester": "4-1",
        "cgpa": 8.8,
        "target_role": "Machine Learning Engineer",
        "study_hours": 3,
        "xp": 1250,
        "streak_days": 5,
        "level": "Level 4 - Advanced Apprentice",
        "onboarding_complete": True,
        "skills": [
            {"name": "Python", "category": "Programming", "self_declared": 80.0, "demonstrated_score": 85.0, "status": "Declared"},
            {"name": "SQL", "category": "Database", "self_declared": 70.0, "demonstrated_score": 75.0, "status": "Declared"},
            {"name": "Statistics", "category": "Mathematics", "self_declared": 60.0, "demonstrated_score": 65.0, "status": "Declared"},
            {"name": "Machine Learning", "category": "AI / ML", "self_declared": 60.0, "demonstrated_score": 60.0, "status": "Declared"},
            {"name": "Power BI", "category": "Analytics", "self_declared": 50.0, "demonstrated_score": 50.0, "status": "Declared"},
        ],
    }
}


@router.post("/send-otp", response_model=SendOTPResponse)
def send_otp(request: SendOTPRequest, background_tasks: BackgroundTasks):
    """Step 1: Receives email, generates 6-digit OTP, sends via email."""
    email = request.email.lower().strip()

    # Generate 6-digit numeric OTP
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    otp_store[email] = {"otp": otp, "expires_at": expires_at}
    logger.info(f"Generated OTP for {email}: {otp}")

    # Send email in background
    background_tasks.add_task(send_otp_email, email, otp)

    return SendOTPResponse(success=True, message="OTP sent to your email")


@router.post("/verify-otp", response_model=VerifyOTPResponse)
def verify_otp(request: VerifyOTPRequest):
    """
    Step 2: Validates OTP.
    - If student exists: returns registered=True + access_token + student.
    - If new student: returns registered=False + temp_token for onboarding.
    """
    email = request.email.lower().strip()
    otp = request.otp.strip()

    stored_data = otp_store.get(email)
    if not stored_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP found for this email. Please request a new OTP.",
        )

    if datetime.now(timezone.utc) > stored_data["expires_at"]:
        del otp_store[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one.",
        )

    if stored_data["otp"] != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code. Please check your email.",
        )

    # OTP verified — clear from store
    del otp_store[email]

    student = students_db.get(email)

    if student and student.get("onboarding_complete"):
        # Existing registered student — return full token + profile
        access_token = create_access_token(subject=email)
        return VerifyOTPResponse(
            registered=True,
            access_token=access_token,
            token_type="bearer",
            student=student,
        )
    else:
        # New student — issue a short-lived temp token for onboarding
        temp_token = create_access_token(
            subject=f"temp:{email}",
            expires_delta=timedelta(minutes=30),
        )
        temp_token_store[temp_token] = email
        return VerifyOTPResponse(
            registered=False,
            temp_token=temp_token,
            email=email,
        )


@router.post("/complete-onboarding", response_model=TokenResponse)
def complete_onboarding(request: CompleteOnboardingRequest):
    """
    Step 3 (new users only): Receives full profile + temp_token.
    Creates the permanent student record, initialises skills with status 'Declared',
    and returns the final access_token.
    """
    email = request.email.lower().strip()

    # Validate temp token
    stored_email = temp_token_store.get(request.temp_token)
    if not stored_email or stored_email != email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired onboarding session. Please restart authentication.",
        )

    # Remove temp token now that it's been consumed
    del temp_token_store[request.temp_token]

    level_score_map = {"Advanced": 80.0, "Intermediate": 60.0, "Beginner": 30.0}
    processed_skills = []
    for item in request.skills:
        score = level_score_map.get(item.level, 50.0)
        processed_skills.append(
            {
                "name": item.name,
                "category": item.category or "Technical",
                "self_declared": score,
                "demonstrated_score": score,
                "status": "Declared",
            }
        )

    if not processed_skills:
        processed_skills = [
            {"name": "Python", "category": "Programming", "self_declared": 50.0, "demonstrated_score": 50.0, "status": "Declared"},
        ]

    student = {
        "id": random.randint(100, 99999),
        "email": email,
        "name": request.name,
        "full_name": request.name,
        "college": request.college,
        "branch": request.branch,
        "semester": request.semester,
        "cgpa": float(request.cgpa),
        "target_role": request.target_role,
        "study_hours": int(request.study_hours),
        "skills": processed_skills,
        "xp": 100,
        "streak_days": 1,
        "level": "Level 1 - Beginner",
        "onboarding_complete": True,
    }

    students_db[email] = student

    access_token = create_access_token(subject=email)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        registered=True,
        student=student,
    )


@router.post("/register", response_model=TokenResponse)
def register_student(request: StudentRegisterRequest):
    """Legacy registration endpoint (kept for compatibility)."""
    email = request.email.lower().strip()

    level_score_map = {"Advanced": 80.0, "Intermediate": 60.0, "Beginner": 30.0}
    processed_skills = [
        {
            "name": item.name,
            "category": item.category or "Technical",
            "self_declared": level_score_map.get(item.level, 50.0),
            "demonstrated_score": level_score_map.get(item.level, 50.0),
            "status": "Declared",
        }
        for item in request.skills
    ] or [
        {"name": "Python", "category": "Programming", "self_declared": 80.0, "demonstrated_score": 80.0, "status": "Declared"},
        {"name": "SQL", "category": "Database", "self_declared": 60.0, "demonstrated_score": 60.0, "status": "Declared"},
    ]

    student = {
        "id": random.randint(100, 999),
        "email": email,
        "name": request.full_name,
        "full_name": request.full_name,
        "college": request.college,
        "branch": request.branch,
        "semester": request.semester,
        "cgpa": float(request.cgpa),
        "target_role": request.target_role,
        "study_hours": int(request.study_hours),
        "skills": processed_skills,
        "xp": 100,
        "streak_days": 1,
        "level": "Level 1 - Beginner",
        "onboarding_complete": True,
    }

    students_db[email] = student
    access_token = create_access_token(subject=email)
    return TokenResponse(access_token=access_token, token_type="bearer", student=student)


@router.get("/me")
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """Validates Bearer token and returns the full student profile."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Bearer token missing.",
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )

    subject = payload["sub"]
    # Reject temp tokens
    if subject.startswith("temp:"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Onboarding token cannot be used to authenticate.",
        )

    email = subject.lower().strip()
    student = students_db.get(email)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )

    return {"authenticated": True, "student": student}
