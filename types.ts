export enum QuestionType {
  MCQ = 'mcq',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer'
}

export interface Question {
  id: string;
  type: string; // cast to QuestionType
  text: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  type: 'quiz';
  title: string;
  createdAt: number;
  questions: Question[];
  score?: number;
  completed: boolean;
}

export interface DirectSolution {
  id: string;
  type: 'solution';
  title: string;
  createdAt: number;
  question: string;
  answer: string;
  steps: string[];
}

export type HistoryItem = Quiz | DirectSolution;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  isPro: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setProStatus: (status: boolean) => void;
}