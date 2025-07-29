import React, { useState } from "react";
import type { Country, Mode } from "../types";

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

const getOptions = (countries: Country[], correctCountry: Country) => {
  const shuffled = [...countries]
    .filter((country) => country.name !== correctCountry.name)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  return [...shuffled, correctCountry].sort(() => 0.5 - Math.random());
};

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

  const handleSubmit = (answer: string) => {
    setUserAnswer(answer);
    onAnswer(answer);
  };

  return (
    <div className="screen-wrapper">
      <div className="card flex flex-col">
        <button className="btn-quit-top" onClick={onPause}>
          ⏸️ Pause
        </button>
        <p className="mb-4 text-lg font-semibold">
          Question {questionIndex + 1} of {totalQuestions} 📝
        </p>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={`https://flagcdn.com/${correctCountry.code.toLowerCase()}.svg`}
            alt="Flag"
            className="flag-image"
          />
        </div>

        {mode === "easy" ? (
          <div className="option-container mb-2">
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
          <div className="items-center option-container mb-2">
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
