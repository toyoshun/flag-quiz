import type { Country, Mode, Screen, ResumeScreen } from "../types";

/** Key used for persisting quiz state in localStorage */
export const STORAGE_KEY = "flag-quiz-state";

/** Structure of the persisted quiz state */
export interface PersistedState {
  screen: Screen;
  mode: Mode;
  questionIndex: number;
  score: number;
  countries: Country[];
  userAnswer: string;
  isCorrect: boolean;
  totalQuestions: number;
  isPaused: boolean;
  resumeScreen: ResumeScreen;
}

/** Load the quiz state from localStorage */
export const loadState = (): Partial<PersistedState> | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as Partial<PersistedState>;
  } catch {
    return null;
  }
};

/** Save the quiz state to localStorage */
export const saveState = (state: PersistedState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
