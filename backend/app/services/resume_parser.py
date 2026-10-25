def parse_resume_text(text: str):
    """
    Mock implementation for parsing a resume.
    In a real implementation, this would use an LLM or NLP library (e.g. spaCy)
    to extract skills, education, and experience.
    """
    extracted_skills = []
    
    # Simple keyword matching for MVP
    keywords = ["Python", "SQL", "Machine Learning", "React", "Data Analysis", "FastAPI"]
    for keyword in keywords:
        if keyword.lower() in text.lower():
            extracted_skills.append({
                "name": keyword,
                "confidence": 0.8
            })
            
    return {
        "skills": extracted_skills,
        "education": "Unknown",
        "experience": []
    }
