import React, { useEffect, useState } from "react";
import { StartScreen } from "./screens/StartScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { ResultScreen } from "./screens/ResultScreen";
import countriesData from "./data/country.json";
import type { Country, Mode } from "./types";

type Screen = "start" | "quiz" | "feedback" | "result";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCountries = (data: any[]): Country[] =>
  data.map((country) => ({
    name: country.name.common || "Unknown",
    code: country.cca2 || "",
    region: country.region || "Other",
  }));

const filterCountriesByRegion = (
  countries: Country[],
  region: string
): Country[] =>
  region === "World"
    ? countries
    : countries.filter((country) => country.region === region);

const allCountries = normalizeCountries(countriesData);
const STORAGE_KEY = "flag-quiz-state";

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<Mode>("easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const correctCountry = countries[questionIndex] ?? ({} as Country);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScreen(parsed.screen ?? "start");
        setMode(parsed.mode ?? "easy");
        setQuestionIndex(parsed.questionIndex ?? 0);
        setScore(parsed.score ?? 0);
        setCountries(parsed.countries ?? []);
        setUserAnswer(parsed.userAnswer ?? "");
        setIsCorrect(parsed.isCorrect ?? false);
        setTotalQuestions(parsed.totalQuestions ?? 10);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      screen,
      mode,
      questionIndex,
      score,
      countries,
      userAnswer,
      isCorrect,
      totalQuestions,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    screen,
    mode,
    questionIndex,
    score,
    countries,
    userAnswer,
    isCorrect,
    totalQuestions,
  ]);

  const handleStart = (
    selectedMode: Mode,
    selectedRegion: string,
    selectedTotal: number
  ) => {
    const filteredCountries = filterCountriesByRegion(
      allCountries,
      selectedRegion
    );
    const shuffledCountries = filteredCountries
      .sort(() => 0.5 - Math.random())
      .slice(0, selectedTotal);

    setMode(selectedMode);
    setQuestionIndex(0);
    setScore(0);
    setCountries(shuffledCountries);
    setUserAnswer("");
    setIsCorrect(false);
    setTotalQuestions(selectedTotal);
    setScreen("quiz");
  };

  const handleAnswer = (userAnswer: string) => {
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctCountry.name.toLowerCase();
    if (isCorrect) setScore((prev: number) => prev + 1);
    setIsCorrect(isCorrect);
    setUserAnswer(userAnswer);
    setScreen("feedback");
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((prev: number) => prev + 1);
      setIsCorrect(false);
      setUserAnswer("");
      setScreen("quiz");
    } else {
      setScreen("result");
    }
  };

  const restartQuiz = () => {
    localStorage.removeItem(STORAGE_KEY);
    setScreen("start");
  };

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      {screen === "start" && (
        <StartScreen onStart={handleStart} allCountries={allCountries} />
      )}
      {screen === "quiz" && (
        <QuizScreen
          mode={mode}
          countries={countries}
          questionIndex={questionIndex}
          correctCountry={correctCountry}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
          setUserAnswer={setUserAnswer}
          onQuit={restartQuiz}
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
          onQuit={restartQuiz}
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
