export type GameState = 'START' | 'PLAYING' | 'FINISHED';

export interface Question {
  factorA: number;
  factorB: number;
  answer: number;
}

export interface AnswerHistory {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // in milliseconds (optional usage)
}

export interface GameStats {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number; // percentage 0-100
  history: AnswerHistory[];
}
