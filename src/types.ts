export type Country = {
  name: string;
  code: string;
  region: string;
};

export type Mode = "easy" | "hard";

export type Region = "World" | "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";

// Screens used by the main application
export type Screen = "start" | "quiz" | "feedback" | "result";
// Screen value stored when pausing the quiz
export type ResumeScreen = Screen | "feedback-next";
