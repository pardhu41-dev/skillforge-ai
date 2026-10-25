export interface InterviewQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Problem Solving';
  expectedConcepts: string[];
  sampleGoodAnswer: string;
}

export interface InterviewRole {
  id: string;
  roleTitle: string;
  type: 'Technical' | 'Behavioral';
  description: string;
  questions: InterviewQuestion[];
}

export interface InterviewScorecard {
  overallScore: number;
  technicalAccuracy: number;
  clarityScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  eyeContactPercent: number;
  postureScore: number;
  vocalModulationScore: number;
  wpmAverage: number;
  fillerWordsCount: number;
  strengths: string[];
  improvements: string[];
}


export const mockInterviewRoles: InterviewRole[] = [
  {
    id: 'role-data-analyst-tech',
    roleTitle: 'Data Analyst (Technical)',
    type: 'Technical',
    description: 'Technical interview focusing on SQL aggregations, windowing functions, Python Pandas data manipulation, and statistical hypothesis testing.',
    questions: [
      {
        id: 1,
        question: 'Can you walk me through how you would optimize a slow SQL query with multiple JOINs and a large dataset?',
        category: 'Technical',
        expectedConcepts: ['Indexing', 'EXPLAIN execution plan', 'Avoiding SELECT *', 'Window functions vs Subqueries'],
        sampleGoodAnswer: 'I would start by analyzing the query execution plan using EXPLAIN to identify bottlenecks like full table scans. I would ensure indexing on join foreign keys and filter predicates, replace SELECT * with necessary columns, and replace correlated subqueries with CTEs or window functions.'
      },
      {
        id: 2,
        question: 'Explain the difference between inner, left outer, and full outer joins, and give a scenario where a left join is essential.',
        category: 'Technical',
        expectedConcepts: ['INNER JOIN', 'LEFT JOIN', 'NULL values', 'Preserving left table records'],
        sampleGoodAnswer: 'An INNER JOIN returns only matching rows. A LEFT JOIN returns all rows from the left table plus matching rows from the right table. A LEFT JOIN is essential when analyzing customer activity where we want all registered users regardless of whether they made a purchase.'
      },
      {
        id: 3,
        question: 'How do you handle missing or noisy data in a dataset using Python Pandas before building an analytics dashboard?',
        category: 'Technical',
        expectedConcepts: ['fillna', 'dropna', 'outlier detection', 'imputation'],
        sampleGoodAnswer: 'I inspect missing data using df.isnull().sum(). Depending on domain context, I impute numerical features using median or mean, remove corrupt rows, and detect outliers using IQR or z-scores.'
      }
    ]
  },
  {
    id: 'role-ml-engineer-tech',
    roleTitle: 'Junior ML Engineer (Technical)',
    type: 'Technical',
    description: 'Deep dive into machine learning fundamentals, overfitting mitigation, feature engineering, and model deployment.',
    questions: [
      {
        id: 1,
        question: 'What is the bias-variance tradeoff in Machine Learning, and how do techniques like L1/L2 regularization address it?',
        category: 'Technical',
        expectedConcepts: ['Bias', 'Variance', 'Overfitting', 'L1 Lasso', 'L2 Ridge'],
        sampleGoodAnswer: 'High bias leads to underfitting while high variance leads to overfitting. L1 (Lasso) adds absolute coefficient penalties promoting sparsity, while L2 (Ridge) adds squared penalties shrinking weights.'
      },
      {
        id: 2,
        question: 'How do you deploy a trained PyTorch or Scikit-Learn model to a REST endpoint with low latency?',
        category: 'Technical',
        expectedConcepts: ['FastAPI', 'ONNX', 'Batching', 'Docker containerization'],
        sampleGoodAnswer: 'I export the model to ONNX or TorchScript for inference optimization, containerize the inference service using Docker, and serve requests asynchronously via FastAPI.'
      }
    ]
  },
  {
    id: 'role-behavioral',
    roleTitle: 'Behavioral & Culture Fit (All Roles)',
    type: 'Behavioral',
    description: 'STAR-method interview evaluating teamwork, conflict resolution, project management, and career goals.',
    questions: [
      {
        id: 1,
        question: 'Tell me about a time when you faced a tight deadline on a project and discovered a major data discrepancy. How did you handle it?',
        category: 'Behavioral',
        expectedConcepts: ['STAR Method', 'Prioritization', 'Transparent communication', 'Problem solving'],
        sampleGoodAnswer: 'Using the STAR method: Situation (imminent deadline), Task (deliver dashboard), Action (flagged discrepancy to team lead, performed quick root-cause audit, fixed broken ETL key), Result (delivered on time with verified data).'
      }
    ]
  }
];
