from pydantic import BaseModel, ConfigDict
from typing import Optional

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class StudentSkillBase(BaseModel):
    proficiency_level: float
    confidence_score: float
    evidence: Optional[str] = None

class StudentSkill(StudentSkillBase):
    id: int
    student_id: int
    skill_id: int
    skill: Skill

    model_config = ConfigDict(from_attributes=True)

