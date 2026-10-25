from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class StudentBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = None

class StudentCreate(StudentBase):
    email: EmailStr
    password: str
    full_name: str

class StudentUpdate(StudentBase):
    password: Optional[str] = None

class StudentInDBBase(StudentBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Student(StudentInDBBase):
    pass

