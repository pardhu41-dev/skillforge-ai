from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Student(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    branch = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)

    skills = relationship("StudentSkill", back_populates="student")
