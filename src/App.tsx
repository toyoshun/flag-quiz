import React, { useEffect, useState } from "react";
import { StartScreen } from "./screens/StartScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { ResultScreen } from "./screens/ResultScreen";
import countriesData from "./data/country.json";
import type { Country, Mode, Screen, ResumeScreen, Region } from "./types";
import { normalizeCountries, filterCountriesByRegion } from "./utils/country";
import { loadState, saveState, STORAGE_KEY } from "./utils/storage";

// Prepare the country list used throughout the app
const allCountries = normalizeCountries(countriesData);

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [mode, setMode] = useState<Mode>("easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [resumeScreen, setResumeScreen] = useState<ResumeScreen>("quiz");
  const correctCountry = countries[questionIndex] ?? ({} as Country);

  // Load persisted quiz state on initial render
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setScreen((saved.screen as Screen) ?? "start");
      setMode((saved.mode as Mode) ?? "easy");
      setQuestionIndex(saved.questionIndex ?? 0);
      setScore(saved.score ?? 0);
      setCountries(saved.countries ?? []);
      setUserAnswer(saved.userAnswer ?? "");
      setIsCorrect(saved.isCorrect ?? false);
      setTotalQuestions(saved.totalQuestions ?? 10);
      setIsPaused(saved.isPaused ?? false);
      setResumeScreen((saved.resumeScreen as ResumeScreen) ?? "quiz");
    }
  }, []);

  // Persist quiz state whenever relevant values change
  useEffect(() => {
    saveState({
      screen,
      mode,
      questionIndex,
      score,
      countries,
      userAnswer,
      isCorrect,
      totalQuestions,
      isPaused,
      resumeScreen,
    });
  }, [
    screen,
    mode,
    questionIndex,
    score,
    countries,
    userAnswer,
    isCorrect,
    totalQuestions,
    isPaused,
    resumeScreen,
  ]);

  const handleStart = (
    selectedMode: Mode,
    selectedRegion: Region,
    selectedTotal: number
  ) => {
    // Prepare the quiz using the chosen options
    const filteredCountries = filterCountriesByRegion(
      allCountries,
      selectedRegion
    );
    const shuffledCountries = [...filteredCountries]
      .sort(() => 0.5 - Math.random())
      .slice(0, selectedTotal);

    setMode(selectedMode);
    setQuestionIndex(0);
    setScore(0);
    setCountries(shuffledCountries);
    setUserAnswer("");
    setIsCorrect(false);
    setTotalQuestions(selectedTotal);
    setIsPaused(false);
    setResumeScreen("quiz");
    setScreen("quiz");
  };

  const handleAnswer = (userAnswer: string) => {
    // Check if the user's answer matches the correct country
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctCountry.name.toLowerCase();
    if (isCorrect) setScore((prev: number) => prev + 1);
    setIsCorrect(isCorrect);
    setUserAnswer(userAnswer);
    setScreen("feedback");
  };

  const nextQuestion = () => {
    // Advance to the next question or finish the quiz
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((prev: number) => prev + 1);
      setIsCorrect(false);
      setUserAnswer("");
      setScreen("quiz");
    } else {
      setScreen("result");
    }
  };

  const pauseQuiz = () => {
    const confirmPause = window.confirm("Are you sure you want to pause the quiz?");
    if (!confirmPause) return;
    const next = screen === "feedback" ? "feedback-next" : screen;
    setResumeScreen(next);
    setIsPaused(true);
    setScreen("start");
  };

  const resumeQuiz = () => {
    // Restore the quiz to the state before it was paused
    setIsPaused(false);
    if (resumeScreen === "feedback-next") {
      nextQuestion();
    } else {
      setScreen(resumeScreen);
    }
  };

  const restartQuiz = () => {
    // Clear any persisted state before starting over
    localStorage.removeItem(STORAGE_KEY);
    setIsPaused(false);
    setScreen("start");
  };

  // Treat closing or reloading the tab as pausing the quiz
  useEffect(() => {
    const handleBeforeUnload = () => {
      const next = screen === "feedback" ? "feedback-next" : screen;
      saveState({
        screen: "start",
        mode,
        questionIndex,
        score,
        countries,
        userAnswer,
        isCorrect,
        totalQuestions,
        isPaused: true,
        resumeScreen: next,
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      {screen === "start" && (
        <StartScreen
          onStart={handleStart}
          allCountries={allCountries}
          onResume={resumeQuiz}
          canResume={isPaused}
        />
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
          onPause={pauseQuiz}
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
          onPause={pauseQuiz}
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
