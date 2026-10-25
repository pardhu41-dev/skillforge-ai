export interface StudentProfile {
  name: string;
  degree: string;
  avatar: string;
  xp: number;
  streakDays: number;
  level: string;
  levelProgress: number; // percentage 0-100
  targetRole: string;
}

export interface MetricData {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  iconName: string;
  accentColor: string;
}

export interface SkillGapItem {
  skill: string;
  demonstrated: number;
  required: number;
  category: string;
}

export interface CareerMatch {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  salaryRange: string;
  openings: number;
  topGaps: string[];
  keyStrengths: string[];
}

export interface ScheduleItem {
  id: string;
  day: string;
  title: string;
  skillDomain: string;
  estimatedMinutes: number;
  completed: boolean;
  type: 'assessment' | 'coding' | 'reading' | 'project';
}

export interface AssessmentEvidence {
  id: string;
  topic: string;
  category: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  timestamp: string;
  evidenceType: string;
}

export const mockStudentProfile: StudentProfile = {
  name: "G. P. P. Saradhi",
  degree: "B.Tech AI & DS",
  avatar: "GS",
  xp: 1250,
  streakDays: 5,
  level: "Level 4 - Advanced Apprentice",
  levelProgress: 68,
  targetRole: "Data Analyst / AI Engineer"
};

export const mockMetrics: MetricData[] = [
  {
    id: "readiness",
    title: "Career Readiness",
    value: "78%",
    subtext: "+4% from last week",
    trend: "up",
    trendValue: "+4%",
    iconName: "Target",
    accentColor: "from-blue-500 to-indigo-600"
  },
  {
    id: "skills",
    title: "Demonstrated Skills",
    value: "14 / 18",
    subtext: "4 skills near benchmark",
    trend: "up",
    trendValue: "+2",
    iconName: "Award",
    accentColor: "from-cyan-500 to-blue-600"
  },
  {
    id: "streak",
    title: "Learning Streak",
    value: "5 Days",
    subtext: "Best: 12 days",
    trend: "up",
    trendValue: "Active",
    iconName: "Flame",
    accentColor: "from-amber-500 to-orange-600"
  },
  {
    id: "cgpa",
    title: "Academic CGPA",
    value: "8.8",
    subtext: "Semester 6 verified",
    trend: "neutral",
    trendValue: "Stable",
    iconName: "GraduationCap",
    accentColor: "from-emerald-500 to-teal-600"
  }
];

export const mockSkillGaps: SkillGapItem[] = [
  { skill: "Python", demonstrated: 88, required: 85, category: "Languages" },
  { skill: "SQL & Relational DB", demonstrated: 76, required: 85, category: "Data Management" },
  { skill: "Statistics & Probability", demonstrated: 64, required: 75, category: "Math & Analytics" },
  { skill: "Data Visualization", demonstrated: 80, required: 70, category: "Analytics" },
  { skill: "Machine Learning", demonstrated: 55, required: 70, category: "AI & Data Science" },
  { skill: "Power BI / Tableau", demonstrated: 42, required: 75, category: "BI Tools" },
  { skill: "FastAPI / Backend", demonstrated: 70, required: 60, category: "Engineering" }
];

export const mockCareerMatches: CareerMatch[] = [
  {
    id: "c1",
    title: "Data Analyst",
    company: "Tech Corp & Startups",
    matchScore: 84,
    salaryRange: "₹6 - ₹10 LPA",
    openings: 142,
    topGaps: ["Power BI", "Advanced Window Functions"],
    keyStrengths: ["Python Pandas", "Data Visualization", "SQL Fundamentals"]
  },
  {
    id: "c2",
    title: "Junior AI Engineer",
    company: "Enterprise AI Labs",
    matchScore: 74,
    salaryRange: "₹8 - ₹14 LPA",
    openings: 89,
    topGaps: ["Model Deployment", "PyTorch / TensorFlow"],
    keyStrengths: ["FastAPI", "Python Algorithms", "ML Fundamentals"]
  },
  {
    id: "c3",
    title: "Data Engineer Associate",
    company: "Cloud Systems Inc.",
    matchScore: 68,
    salaryRange: "₹7 - ₹12 LPA",
    openings: 64,
    topGaps: ["Apache Spark", "ETL Pipelines", "Docker"],
    keyStrengths: ["SQL Databases", "Python Scripting"]
  }
];

export const mockStudySchedule: ScheduleItem[] = [
  {
    id: "s1",
    day: "Monday",
    title: "Practice SQL Window Functions & Subqueries",
    skillDomain: "SQL & DB",
    estimatedMinutes: 45,
    completed: true,
    type: "coding"
  },
  {
    id: "s2",
    day: "Tuesday",
    title: "Power BI Dashboard Building & DAX Basics",
    skillDomain: "BI Tools",
    estimatedMinutes: 60,
    completed: false,
    type: "project"
  },
  {
    id: "s3",
    day: "Wednesday",
    title: "Statistical Hypothesis Testing & A/B Experiments",
    skillDomain: "Statistics",
    estimatedMinutes: 30,
    completed: false,
    type: "reading"
  },
  {
    id: "s4",
    day: "Thursday",
    title: "FastAPI Async Endpoints & Middleware Quiz",
    skillDomain: "Backend",
    estimatedMinutes: 25,
    completed: false,
    type: "assessment"
  },
  {
    id: "s5",
    day: "Friday",
    title: "Scikit-Learn Regression & Classification Lab",
    skillDomain: "Machine Learning",
    estimatedMinutes: 50,
    completed: false,
    type: "coding"
  }
];

export const mockAssessmentEvidence: AssessmentEvidence[] = [
  {
    id: "e1",
    topic: "Python Data Analysis (Pandas & NumPy)",
    category: "Coding Assessment",
    score: 92,
    confidence: "High",
    timestamp: "Today, 14:30",
    evidenceType: "Automated Test Suite"
  },
  {
    id: "e2",
    topic: "SQL Aggregations & Joins",
    category: "Technical Assessment",
    score: 85,
    confidence: "High",
    timestamp: "Yesterday",
    evidenceType: "SQL Playground"
  },
  {
    id: "e3",
    topic: "FastAPI REST Endpoint Design",
    category: "Project Submission",
    score: 78,
    confidence: "Medium",
    timestamp: "2 days ago",
    evidenceType: "Git Repository Audit"
  },
  {
    id: "e4",
    topic: "Probability Distributions & Hypothesis",
    category: "Quiz Assessment",
    score: 65,
    confidence: "Medium",
    timestamp: "3 days ago",
    evidenceType: "Multiple Choice Evaluation"
  },
  {
    id: "e5",
    topic: "Power BI Data Modeling",
    category: "Practical Test",
    score: 50,
    confidence: "Low",
    timestamp: "5 days ago",
    evidenceType: "Instructor Verified"
  }
];
