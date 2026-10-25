from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any


class SendOTPRequest(BaseModel):
    email: EmailStr


class SendOTPResponse(BaseModel):
    success: bool = True
    message: str = "OTP sent to your email"


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class SkillSelectionItem(BaseModel):
    name: str
    category: Optional[str] = "Technical"
    level: str  # Beginner, Intermediate, Advanced


class CompleteOnboardingRequest(BaseModel):
    email: EmailStr
    temp_token: str
    name: str
    college: str
    branch: str
    semester: str
    cgpa: float
    target_role: str
    study_hours: int = 2
    skills: List[SkillSelectionItem] = []


class StudentRegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    college: str
    branch: str
    semester: str
    cgpa: float
    target_role: str
    study_hours: int = 2
    skills: List[SkillSelectionItem] = []


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    registered: bool = True
    student: dict


class VerifyOTPResponse(BaseModel):
    registered: bool
    # If registered=True
    access_token: Optional[str] = None
    token_type: str = "bearer"
    student: Optional[Any] = None
    # If registered=False
    temp_token: Optional[str] = None
    email: Optional[str] = None
