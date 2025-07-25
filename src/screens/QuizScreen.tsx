import React, { useEffect, useState } from "react";
import type { Country, Mode } from "../types";

interface QuizScreenProps {
  mode: Mode;
  countries: Country[];
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (userAnswer: string) => void;
  correctCountry: Country | null;
  setCorrectCountry: (country: Country) => void;
  setUserAnswer: (userAnswer: string) => void;
}

const getRandomCountry = (countries: Country[], usedCountry: Set<string>) => {
  const unused = countries.filter((country) => !usedCountry.has(country.name));
  return unused[Math.floor(Math.random() * unused.length)];
};

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
  totalQuestions,
  onAnswer,
  correctCountry,
  setCorrectCountry,
  setUserAnswer,
}) => {
  const [usedCountries] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");

  useEffect(() => {
    const nextCountry = getRandomCountry(countries, usedCountries);
    usedCountries.add(nextCountry.name);
    setCorrectCountry(nextCountry);
  }, [questionIndex]);

  const handleSubmit = (answer: string) => {
    setUserAnswer(answer);
    onAnswer(answer);
  };

  if (!correctCountry) return <div className="screen-wrapper">Loading...</div>;

  return (
    <div className="screen-wrapper">
      <p className="mb-4 text-lg font-semibold">
        Question {questionIndex + 1} of {totalQuestions}
      </p>

      <img
        src={`https://flagcdn.com/${correctCountry.code.toLowerCase()}.svg`}
        alt="Flag"
        className="flag-image"
      />

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
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
