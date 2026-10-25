from app.services.resume_parser import parse_resume_text
from app.services.job_matching import match_student_to_job

def test_resume_parser():
    resume_text = "I am a software engineer with 5 years of experience in Python and FastAPI. I also know React and SQL."
    parsed_data = parse_resume_text(resume_text)
    
    assert "skills" in parsed_data
    skills = [s["name"] for s in parsed_data["skills"]]
    assert "Python" in skills
    assert "SQL" in skills
    assert "React" in skills
    assert "FastAPI" in skills
    assert "Machine Learning" not in skills

def test_job_matching():
    student_skills = [
        {"name": "Python", "confidence": 0.9},
        {"name": "SQL", "confidence": 0.8},
        {"name": "React", "confidence": 0.7}
    ]
    job_reqs = [
        {"name": "Python"},
        {"name": "SQL"},
        {"name": "Machine Learning"}
    ]
    
    # The job reqs has 3 skills, student has 2 of them (Python, SQL).
    # Score should be (2/3) * 100 = 66.66%
    score = match_student_to_job(student_skills, job_reqs)
    assert abs(score - 66.66) < 0.1
    
    # If job reqs is empty, score is 0
    assert match_student_to_job(student_skills, []) == 0.0
