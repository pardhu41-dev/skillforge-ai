def match_student_to_job(student_skills: list, job_requirements: list):
    """
    Mock implementation for job matching.
    In a real implementation, this would use vector embeddings and similarity search
    (e.g., using pgvector and sentence-transformers) to calculate an alignment score.
    """
    student_skill_names = {s["name"].lower() for s in student_skills}
    job_req_names = {r["name"].lower() for r in job_requirements}
    
    if not job_req_names:
        return 0.0
        
    overlap = student_skill_names.intersection(job_req_names)
    score = len(overlap) / len(job_req_names) * 100
    
    return score
