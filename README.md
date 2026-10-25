# SkillForge AI

An AI-driven platform for student skill assessment, resume parsing, and career path recommendations.

## Project Structure

```text
skillforge-ai/
├── backend/          # FastAPI backend service
│   ├── alembic/      # Database migrations
│   ├── app/          # Core application logic, endpoints, models, schemas
│   ├── tests/        # Pytest test suite
│   ├── .env.example  # Backend environment variables template
│   └── requirements.txt
├── frontend/         # Next.js (TypeScript, React, Tailwind CSS)
│   ├── src/          # Frontend application code, components, context
│   └── package.json
└── .gitignore
```

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env` and configure your credentials.
5. Run migrations:
   ```bash
   alembic upgrade head
   ```
6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
