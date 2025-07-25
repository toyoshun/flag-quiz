import React, { useState } from "react";
import { StartScreen } from "./screens/StartScreen";
import { QuizScreen } from "./screens/QuizScreen"; // 仮のインポート
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { ResultScreen } from "./screens/ResultScreen";
import countriesData from "./data/country.json";
import type { Country } from "./types";

type Screen = "start" | "quiz" | "feedback" | "result";

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<"easy" | "hard">("easy");
  const [region, setRegion] = useState<string>("All");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const totalQuestions = 10;

  const nomalizedCountries = countriesData.map((country) => ({
    name: country.name?.common || "Unknown",
    code: country.cca2 || "",
    region: country.region || "Other",
  }));

  const filteredCountries =
    region === "World"
      ? nomalizedCountries
      : nomalizedCountries.filter((country) => country.region === region);

  const handleStart = (
    selectedMode: "easy" | "hard",
    selectedRegion: string
  ) => {
    setMode(selectedMode);
    setRegion(selectedRegion);
    setQuestionIndex(0);
    setScore(0);
    setScreen("quiz");
  };

  const handleAnswer = (userAnswer: string) => {
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctCountry?.name.toLowerCase();

    if (isCorrect) setScore((prev) => prev + 1);
    setIsCorrect(isCorrect);
    setScreen("feedback");
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((prev) => prev + 1);
      setIsCorrect(false);
      setScreen("quiz");
    } else {
      setScreen("result");
    }
  };

  const restartQuiz = () => {
    setScreen("start");
  };

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "quiz" && (
        <QuizScreen
          mode={mode}
          countries={filteredCountries}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
          correctCountry={correctCountry}
          setCorrectCountry={setCorrectCountry}
          setUserAnswer={setUserAnswer}
        />
      )}
      {screen === "feedback" && (
        <FeedbackScreen
          isCorrect={isCorrect}
          correctCountry={correctCountry}
          userAnswer={userAnswer}
          currentIndex={questionIndex}
          totalQuestions={totalQuestions}
          onNext={nextQuestion}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          score={score}
          total={totalQuestions}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
};

export default App;
