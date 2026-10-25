from sqlalchemy import Column, Integer, String, JSON
from app.db.base_class import Base

class JobRole(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    company = Column(String, index=True)
    description = Column(String)
    
    # Required skills JSON: [{"skill_id": 1, "min_proficiency": 80.0}, ...]
    required_skills = Column(JSON) 
