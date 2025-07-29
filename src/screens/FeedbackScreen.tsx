import React from "react";
import type { Country } from "../types";

interface FeedbackScreenProps {
  isCorrect: boolean;
  correctCountry: Country;
  userAnswer: string;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
  onPause: () => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  isCorrect,
  correctCountry,
  userAnswer,
  onNext,
  currentIndex,
  totalQuestions,
  onPause,
}) => {
  const message = isCorrect ? "Correct! 🎉" : "Wrong! ❌";
  const buttonText =
    currentIndex + 1 === totalQuestions ? "See Results 🏁" : "Next Question ➡️";

  return (
    <div className="screen-wrapper">
      <div className="card flex flex-col">
        <button className="btn-quit-top" onClick={onPause}>
          ⏸️ Pause
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className={isCorrect ? "heading-correct" : "heading-wrong"}>
            {message}
          </h2>

          <p className="paragraph-main">
            Question {currentIndex + 1} of {totalQuestions} 📝
          </p>

          {!isCorrect && (
            <div className="mb-4 text-red-600">
              <p className="paragraph-main">Your answer: {userAnswer}</p>
            </div>
          )}

          <p className="paragraph-main">Correct answer ✅:</p>
          <p className="mb-4 text-xl font-bold">{correctCountry.name}</p>

          <img
            src={`https://flagcdn.com/${correctCountry.code.toLowerCase()}.svg`}
            alt={`Flag of ${correctCountry?.name}`}
            className="flag-image"
          />
        </div>

        <div className="mt-6">
          <button className="btn-main" onClick={onNext}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
