from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SkillForge AI API",
    description="Backend API for SkillForge AI MVP",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SkillForge AI API"}

from app.api.endpoints import auth, student

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(student.router, prefix="/api/v1/student", tags=["Student"])
