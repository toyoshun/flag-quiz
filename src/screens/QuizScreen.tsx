import React, { useState } from "react";
import type { Country, Mode } from "../types";
import { getOptions } from "../utils/quiz";

interface QuizScreenProps {
  mode: Mode;
  countries: Country[];
  questionIndex: number;
  correctCountry: Country;
  totalQuestions: number;
  onAnswer: (userAnswer: string) => void;
  setUserAnswer: (userAnswer: string) => void;
  onPause: () => void;
}

// Shows the current question and accepts an answer from the user

export const QuizScreen: React.FC<QuizScreenProps> = ({
  mode,
  countries,
  questionIndex,
  correctCountry,
  totalQuestions,
  onAnswer,
  setUserAnswer,
  onPause,
}) => {
  const [input, setInput] = useState("");

  // Forward the selected or typed answer to the parent component
  const handleSubmit = (answer: string) => {
    setUserAnswer(answer);
    onAnswer(answer);
  };

  return (
    <div className="screen-wrapper">
      <div className="card">
        <button className="btn-quit-top" onClick={onPause}>
          ⏸️ Pause
        </button>
        <p className="mb-4 text-lg font-semibold">
          Question {questionIndex + 1} of {totalQuestions} 📝
        </p>

      <div
        style={{
          minHeight: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`https://flagcdn.com/${correctCountry.code.toLowerCase()}.svg`}
          alt="Flag"
          className="flag-image"
        />
      </div>

        {mode === "easy" ? (
          <div className="option-container">
            {getOptions(countries, correctCountry).map((country) => (
              <button
                key={country.name}
                className="btn-option"
                onClick={() => handleSubmit(country.name)}
              >
                {country.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="items-center option-container">
            <input
              className="input-main"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter country name"
            />
            <button className="btn-main" onClick={() => handleSubmit(input)}>
              Submit ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
