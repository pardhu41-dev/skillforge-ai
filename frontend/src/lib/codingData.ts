export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  domain: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  constraints: string[];
  sampleCases: TestCase[];
  hiddenCasesCount: number;
  starterCode: {
    python: string;
    javascript: string;
    java: string;
  };
}

export interface ExecutionResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  totalPassed: number;
  totalCases: number;
  runtimeMs: number;
  memoryMb: number;
  outputLog: string[];
  cases: {
    id: number;
    passed: boolean;
    input: string;
    output: string;
    expected: string;
    isHidden?: boolean;
  }[];
}

export interface ComplexityAnalysis {
  timeComplexity: string; // e.g. "O(n)"
  spaceComplexity: string; // e.g. "O(1)"
  qualityScore: number; // 0-100
  plagiarismRisk: 'Low' | 'Medium' | 'High';
  keyInsights: string[];
  refactoringSuggestions: string[];
}

export const mockCodingProblem: CodingProblem = {
  id: 'prob-two-sum-analytics',
  title: 'Top K Frequent Skill Pairs in Log Telemetry',
  difficulty: 'Medium',
  domain: 'Algorithms & Data Structures',
  timeLimit: '2.0 seconds',
  memoryLimit: '256 MB',
  description: `Given an array of student skill event IDs \`skills\` and an integer \`k\`, return the top \`k\` most frequent skill IDs.

You may return the answer in any order. The target runtime complexity should be better than O(n log n) where n is the array size.`,
  constraints: [
    '1 <= skills.length <= 10^5',
    '-10^4 <= skills[i] <= 10^4',
    'k is in the range [1, the number of unique elements in the array]',
    'It is guaranteed that the answer is unique.'
  ],
  sampleCases: [
    {
      id: 1,
      input: 'skills = [1, 1, 1, 2, 2, 3], k = 2',
      expectedOutput: '[1, 2]',
      isHidden: false
    },
    {
      id: 2,
      input: 'skills = [1], k = 1',
      expectedOutput: '[1]',
      isHidden: false
    }
  ],
  hiddenCasesCount: 3,
  starterCode: {
    python: `from typing import List
from collections import Counter
import heapq

def topKFrequent(skills: List[int], k: int) -> List[int]:
    # Write your solution here
    count = Counter(skills)
    return [item for item, _ in count.most_common(k)]
`,
    javascript: `/**
 * @param {number[]} skills
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(skills, k) {
    const map = new Map();
    for (const num of skills) {
        map.set(num, (map.get(num) || 0) + 1);
    }
    return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(entry => entry[0]);
}
`,
    java: `import java.util.*;

class Solution {
    public int[] topKFrequent(int[] skills, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : skills) {
            count.put(n, count.getOrDefault(n, 0) + 1);
        }
        
        PriorityQueue<Integer> heap = new PriorityQueue<>(
            (n1, n2) -> count.get(n1) - count.get(n2)
        );
        
        for (int n : count.keySet()) {
            heap.add(n);
            if (heap.size() > k) heap.poll();
        }
        
        int[] top = new int[k];
        for (int i = k - 1; i >= 0; --i) {
            top[i] = heap.poll();
        }
        return top;
    }
}
`
  }
};
