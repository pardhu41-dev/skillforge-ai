export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  domain: string;
}

export interface QuizDiagnosticResult {
  scorePercent: number;
  correctAnswersCount: number;
  totalQuestions: number;
  xpEarned: number;
  masteryBreakdown: { domain: string; score: number }[];
  recommendation: string;
}

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'In SQL, which clause is required when applying window functions like ROW_NUMBER() or RANK() over a partition?',
    codeSnippet: `SELECT student_id, score, \n  RANK() OVER (PARTITION BY branch ORDER BY score DESC) as rank\nFROM student_scores;`,
    options: [
      'GROUP BY',
      'OVER()',
      'HAVING',
      'WHERE'
    ],
    correctOptionIndex: 1,
    explanation: 'The OVER() clause defines the partition and ordering for window functions in SQL.',
    difficulty: 'Medium',
    domain: 'SQL Window Functions'
  },
  {
    id: 'q2',
    question: 'What is the time complexity of searching for an element in a Python dictionary (hash map) on average?',
    options: [
      'O(n)',
      'O(log n)',
      'O(1)',
      'O(n^2)'
    ],
    correctOptionIndex: 2,
    explanation: 'Python dictionary lookups use a hash table implementation yielding average O(1) time complexity.',
    difficulty: 'Easy',
    domain: 'Python Data Structures'
  },
  {
    id: 'q3',
    question: 'In pandas, which function is used to handle missing values by filling them with a specified value or strategy?',
    codeSnippet: `import pandas as pd\ndf['score'] = df['score'].________(0)`,
    options: [
      'dropna()',
      'fillna()',
      'replace()',
      'interpolate()'
    ],
    correctOptionIndex: 1,
    explanation: 'fillna() replaces NA/NaN values in a DataFrame or Series with a specified scalar or method.',
    difficulty: 'Easy',
    domain: 'Data Processing (Pandas)'
  },
  {
    id: 'q4',
    question: 'When performing a INNER JOIN between Table A (10 rows) and Table B (5 rows), what is the maximum theoretical number of returned rows?',
    options: [
      '5',
      '10',
      '50',
      '15'
    ],
    correctOptionIndex: 2,
    explanation: 'If all keys match all rows (cartesian product scenario), the join produces 10 * 5 = 50 rows.',
    difficulty: 'Hard',
    domain: 'SQL Relational Algebra'
  },
  {
    id: 'q5',
    question: 'What happens when you pass a mutable object like a list as a default parameter in Python function definition?',
    codeSnippet: `def add_item(item, target_list=[]):\n    target_list.append(item)\n    return target_list`,
    options: [
      'A new list is created on every function call.',
      'The list is evaluated once at definition time and shared across calls.',
      'Python throws a TypeError at runtime.',
      'The list is automatically garbage collected after return.'
    ],
    correctOptionIndex: 1,
    explanation: 'Default arguments in Python are evaluated once at function definition, creating a single shared mutable list.',
    difficulty: 'Hard',
    domain: 'Python Advanced Concepts'
  }
];
