export interface QuizItem {
  id: string;
  topic: 'Dermatomes' | 'Myotomes' | 'Major Nerves';
  promptType: 'nerveRoot' | 'dermatome' | 'myotome' | 'nerve';
  promptValue: string;
  options: QuizOption[];
  explanation: string;
  tags: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  imageUri: string;
  isCorrect: boolean;
}

export interface QuizSession {
  topic: string;
  items: QuizItem[];
  currentIndex: number;
  score: number;
  startTime: number;
  questionStartTime: number;
  answers: QuizAnswer[];
  isComplete: boolean;
}

export interface QuizAnswer {
  itemId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  accuracy: number;
  totalTime: number;
  streak: number;
  missedItems: QuizItem[];
}

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}