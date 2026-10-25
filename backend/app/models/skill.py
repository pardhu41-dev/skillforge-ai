from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.db.base_class import Base

class Skill(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True, nullable=False)
    category = Column(String, index=True)
    description = Column(String)
    
    # Example vector column for skill embeddings if needed
    # embedding = Column(Vector(384)) 
    
class StudentSkill(Base):
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"))
    skill_id = Column(Integer, ForeignKey("skill.id"))
    
    proficiency_level = Column(Float, default=0.0) # 0.0 to 100.0
    confidence_score = Column(Float, default=0.0)
    evidence = Column(String) # JSON string of evidence sources
    
    student = relationship("Student", back_populates="skills")
    skill = relationship("Skill")
