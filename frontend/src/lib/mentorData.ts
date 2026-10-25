export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export const mockPromptPills = [
  "Why is my SQL score low?",
  "What should I study today?",
  "Give me a quick 2-minute quiz",
  "How can I prepare for Data Analyst interviews?"
];

export const mockMentorKnowledgeBase: Record<string, string> = {
  "why is my sql score low?": "Your SQL score is currently 64% primarily due to advanced windowing functions (RANK, LEAD, LAG) and complex JOIN aggregations. I recommend spending 45 minutes on the SQL Playground sandbox today.",
  "what should i study today?": "Based on your Data Analyst target pathway, today you should complete the 'Power BI Data Modeling & DAX Expressions' module (est. 60 mins). This will boost your career match score from 78% to 82%.",
  "give me a quick 2-minute quiz": "Here is a quick question: What is the main difference between WHERE and HAVING clauses in SQL? (Hint: WHERE filters individual rows before grouping, while HAVING filters aggregated groups!).",
  "how can i prepare for data analyst interviews?": "Focus on 3 pillars: 1) Complex SQL queries (CTEs and Windowing), 2) Data Storytelling using Power BI/Tableau, and 3) Basic Python Pandas data cleaning. You can also start an AI Mock Interview session right now!"
};
