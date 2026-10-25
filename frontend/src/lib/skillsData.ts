export interface SkillMatrixItem {
  id: string;
  name: string;
  category: 'Languages' | 'Data & DB' | 'Math & Analytics' | 'AI & ML' | 'DevOps & Cloud' | 'Web Engineering';
  selfDeclared: number; // 0-100 percentage
  demonstrated: number; // 0-100 percentage
  status: 'Strong' | 'Developing' | 'Needs Practice' | 'Priority Gap';
  evidenceSource: 'Automated Test Suite' | 'SQL Playground' | 'Lab Evaluation' | 'GitHub Audit' | 'Quiz Assessment' | 'Self Asserted';
  evidenceCount: number;
  lastAssessed: string;
}

export interface RequiredSkillBreakdown {
  skillName: string;
  requiredScore: number;
  currentScore: number;
  status: 'Met' | 'Developing' | 'Missing';
  gapPercentage: number;
}

export interface PathwayStep {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  targetSkill: string;
  resourceType: 'Project Lab' | 'Interactive Course' | 'Assessment Quiz' | 'Guided Tutorial';
  completed: boolean;
}

export interface TargetRoleDetail {
  id: string;
  roleTitle: string;
  category: string;
  matchScore: number; // 0-100
  salaryRange: string;
  industryDemand: 'High' | 'Very High' | 'Moderate';
  description: string;
  requiredSkills: RequiredSkillBreakdown[];
  learningPathway: PathwayStep[];
}

export const mockSkillMatrix: SkillMatrixItem[] = [
  {
    id: 'sk-1',
    name: 'Python',
    category: 'Languages',
    selfDeclared: 90,
    demonstrated: 82,
    status: 'Strong',
    evidenceSource: 'Automated Test Suite',
    evidenceCount: 14,
    lastAssessed: 'Today'
  },
  {
    id: 'sk-2',
    name: 'SQL & Relational DB',
    category: 'Data & DB',
    selfDeclared: 80,
    demonstrated: 64,
    status: 'Developing',
    evidenceSource: 'SQL Playground',
    evidenceCount: 8,
    lastAssessed: 'Yesterday'
  },
  {
    id: 'sk-3',
    name: 'Statistics & Probability',
    category: 'Math & Analytics',
    selfDeclared: 75,
    demonstrated: 58,
    status: 'Needs Practice',
    evidenceSource: 'Quiz Assessment',
    evidenceCount: 5,
    lastAssessed: '3 days ago'
  },
  {
    id: 'sk-4',
    name: 'Machine Learning',
    category: 'AI & ML',
    selfDeclared: 70,
    demonstrated: 62,
    status: 'Developing',
    evidenceSource: 'Lab Evaluation',
    evidenceCount: 6,
    lastAssessed: '4 days ago'
  },
  {
    id: 'sk-5',
    name: 'Deep Learning',
    category: 'AI & ML',
    selfDeclared: 65,
    demonstrated: 41,
    status: 'Priority Gap',
    evidenceSource: 'GitHub Audit',
    evidenceCount: 2,
    lastAssessed: '1 week ago'
  },
  {
    id: 'sk-6',
    name: 'MLOps & Deployment',
    category: 'DevOps & Cloud',
    selfDeclared: 50,
    demonstrated: 24,
    status: 'Priority Gap',
    evidenceSource: 'Self Asserted',
    evidenceCount: 1,
    lastAssessed: '2 weeks ago'
  },
  {
    id: 'sk-7',
    name: 'FastAPI / REST APIs',
    category: 'Web Engineering',
    selfDeclared: 85,
    demonstrated: 76,
    status: 'Strong',
    evidenceSource: 'GitHub Audit',
    evidenceCount: 9,
    lastAssessed: 'Today'
  },
  {
    id: 'sk-8',
    name: 'Power BI & Visualization',
    category: 'Data & DB',
    selfDeclared: 60,
    demonstrated: 45,
    status: 'Priority Gap',
    evidenceSource: 'Lab Evaluation',
    evidenceCount: 3,
    lastAssessed: '5 days ago'
  }
];

export const mockTargetRoles: TargetRoleDetail[] = [
  {
    id: 'role-data-analyst',
    roleTitle: 'Data Analyst',
    category: 'Analytics & BI',
    matchScore: 78,
    salaryRange: '₹6 - ₹10 LPA',
    industryDemand: 'Very High',
    description: 'Translates complex datasets into actionable business insights using SQL, Python, and data visualization tools.',
    requiredSkills: [
      { skillName: 'Python (Pandas & Data Viz)', requiredScore: 80, currentScore: 82, status: 'Met', gapPercentage: 0 },
      { skillName: 'SQL & Window Functions', requiredScore: 85, currentScore: 64, status: 'Developing', gapPercentage: 21 },
      { skillName: 'Statistics & Hypothesis Testing', requiredScore: 75, currentScore: 58, status: 'Developing', gapPercentage: 17 },
      { skillName: 'Power BI & Dashboarding', requiredScore: 75, currentScore: 45, status: 'Missing', gapPercentage: 30 },
      { skillName: 'Business Communication', requiredScore: 70, currentScore: 75, status: 'Met', gapPercentage: 0 }
    ],
    learningPathway: [
      {
        stepNumber: 1,
        title: 'Master Advanced SQL Window Functions & CTEs',
        description: 'Practice complex aggregation queries, windowing functions (RANK, LEAD, LAG), and query optimization.',
        duration: '3 Days (4.5 hrs)',
        targetSkill: 'SQL & Window Functions',
        resourceType: 'Project Lab',
        completed: true
      },
      {
        stepNumber: 2,
        title: 'Power BI Data Modeling & DAX Expressions',
        description: 'Build end-to-end interactive dashboards with star schemas, custom DAX measures, and drill-down reports.',
        duration: '5 Days (8 hrs)',
        targetSkill: 'Power BI & Dashboarding',
        resourceType: 'Interactive Course',
        completed: false
      },
      {
        stepNumber: 3,
        title: 'Statistical Hypothesis Testing & A/B Experimentation',
        description: 'Perform t-tests, ANOVA, Chi-square tests, and confidence interval calculations using Python scipy.',
        duration: '4 Days (6 hrs)',
        targetSkill: 'Statistics & Hypothesis Testing',
        resourceType: 'Guided Tutorial',
        completed: false
      },
      {
        stepNumber: 4,
        title: 'Comprehensive Data Analyst Capstone Assessment',
        description: 'Execute a full-stack data story-telling project from raw database extraction to executive dashboard presentation.',
        duration: '2 Days (4 hrs)',
        targetSkill: 'End-to-End Analytics',
        resourceType: 'Assessment Quiz',
        completed: false
      }
    ]
  },
  {
    id: 'role-ml-engineer',
    roleTitle: 'Machine Learning Engineer',
    category: 'Artificial Intelligence',
    matchScore: 65,
    salaryRange: '₹8 - ₹14 LPA',
    industryDemand: 'High',
    description: 'Designs, builds, and deploys production-grade ML models and automated data pipelines in enterprise environments.',
    requiredSkills: [
      { skillName: 'Python & Data Structures', requiredScore: 85, currentScore: 82, status: 'Met', gapPercentage: 3 },
      { skillName: 'Machine Learning Algorithms', requiredScore: 80, currentScore: 62, status: 'Developing', gapPercentage: 18 },
      { skillName: 'Deep Learning (PyTorch/TensorFlow)', requiredScore: 75, currentScore: 41, status: 'Missing', gapPercentage: 34 },
      { skillName: 'MLOps & Model Serving', requiredScore: 70, currentScore: 24, status: 'Missing', gapPercentage: 46 },
      { skillName: 'FastAPI / Microservices', requiredScore: 70, currentScore: 76, status: 'Met', gapPercentage: 0 }
    ],
    learningPathway: [
      {
        stepNumber: 1,
        title: 'Deep Learning Foundations with PyTorch',
        description: 'Understand neural networks, backpropagation, CNNs for vision, and Transformers for NLP sequence models.',
        duration: '7 Days (12 hrs)',
        targetSkill: 'Deep Learning',
        resourceType: 'Interactive Course',
        completed: false
      },
      {
        stepNumber: 2,
        title: 'MLOps Pipeline Automation with Docker & MLflow',
        description: 'Containerize ML models, track experiment runs, store model artifacts, and set up automated retraining.',
        duration: '6 Days (10 hrs)',
        targetSkill: 'MLOps & Model Serving',
        resourceType: 'Project Lab',
        completed: false
      },
      {
        stepNumber: 3,
        title: 'Model Deployment to FastAPI & Cloud Endpoints',
        description: 'Serve ONNX/TorchScript models via low-latency REST endpoints with batching and request validation.',
        duration: '3 Days (5 hrs)',
        targetSkill: 'FastAPI / Microservices',
        resourceType: 'Guided Tutorial',
        completed: false
      }
    ]
  },
  {
    id: 'role-fullstack-dev',
    roleTitle: 'Full Stack AI Developer',
    category: 'Software Engineering',
    matchScore: 54,
    salaryRange: '₹7 - ₹12 LPA',
    industryDemand: 'High',
    description: 'Builds modern web applications integrating AI APIs, Next.js user interfaces, and scalable backend infrastructure.',
    requiredSkills: [
      { skillName: 'Python & FastAPI', requiredScore: 80, currentScore: 82, status: 'Met', gapPercentage: 0 },
      { skillName: 'React & Next.js', requiredScore: 85, currentScore: 65, status: 'Developing', gapPercentage: 20 },
      { skillName: 'TypeScript & Tailwind', requiredScore: 80, currentScore: 50, status: 'Developing', gapPercentage: 30 },
      { skillName: 'SQL & ORM Architecture', requiredScore: 75, currentScore: 64, status: 'Developing', gapPercentage: 11 },
      { skillName: 'DevOps & Cloud Hosting', requiredScore: 70, currentScore: 24, status: 'Missing', gapPercentage: 46 }
    ],
    learningPathway: [
      {
        stepNumber: 1,
        title: 'Next.js App Router & Server Components',
        description: 'Master server-side rendering, API routes, layout patterns, and Tailwind CSS styling.',
        duration: '5 Days (8 hrs)',
        targetSkill: 'React & Next.js',
        resourceType: 'Project Lab',
        completed: false
      },
      {
        stepNumber: 2,
        title: 'TypeScript Type Safety & State Management',
        description: 'Implement strict TypeScript interfaces, generics, custom hooks, and state management.',
        duration: '4 Days (6 hrs)',
        targetSkill: 'TypeScript & Tailwind',
        resourceType: 'Interactive Course',
        completed: false
      }
    ]
  }
];
