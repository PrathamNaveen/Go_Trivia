"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startTrivia, getNextTrivia, TriviaQuestion } from "./utils/api";
import { RootState, AppDispatch } from "./store/store";
import {
  setUsername,
  startQuiz,
  nextQuestion,
  setLoading,
  setMessage,
  resetQuiz,
} from "./store/slices/quizslice";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { username, quizStarted, questionIndex, loading, message } = useSelector(
    (state: RootState) => state.quiz
  );

  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // --- Start quiz ---
  const handleStart = async () => {
    if (!username.trim()) {
      dispatch(setMessage("Please enter your username"));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setMessage(""));
    setSelectedAnswer(null);

    try {
      await startTrivia({ amount: 5, category: "", difficulty: "" }); // you can extend this with settings later
      const nextQ = await getNextTrivia();
      setQuestion(nextQ);
      dispatch(startQuiz());
    } catch (err: unknown) {
      if (err instanceof Error) dispatch(setMessage(err.message));
      else dispatch(setMessage("An unknown error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- Next question ---
  const handleNext = async () => {
    dispatch(setLoading(true));
    dispatch(setMessage(""));
    setSelectedAnswer(null);

    try {
      const nextQ = await getNextTrivia();
      setQuestion(nextQ);
      dispatch(nextQuestion());
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("No more questions")) {
          dispatch(resetQuiz());
          setQuestion(null);
          setSelectedAnswer(null);
          dispatch(setMessage("No more questions. Start a new quiz!"));
          return;
        } else {
          dispatch(setMessage(err.message));
        }
      } else {
        dispatch(setMessage("An unknown error occurred"));
      }
      setQuestion(null);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- Answer click ---
  const handleAnswerClick = (ans: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);
  };

  const shuffledAnswers = question
    ? [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100">
        {!quizStarted ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
              Setup Trivia Quiz
            </h1>
            {message && <p className="text-red-400 mb-4 text-center">{message}</p>}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={username}
                onChange={(e) => dispatch(setUsername(e.target.value))}
              />

              <button
                onClick={handleStart}
                className="w-full py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition text-white font-semibold"
              >
                {loading ? "Starting..." : "Start Quiz"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-indigo-400">Hello, {username}!</h1>
            {question && (
              <>
                <h2
                  className="text-xl font-semibold mb-6"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
                <ul className="grid gap-3 mb-6">
                  {shuffledAnswers.map((ans, i) => {
                    let bgClass = "bg-gray-700 hover:bg-gray-600";
                    if (selectedAnswer) {
                      if (ans === question.correct_answer) bgClass = "bg-green-600 text-white";
                      else if (ans === selectedAnswer) bgClass = "bg-red-600 text-white";
                    }
                    return (
                      <li
                        key={i}
                        className={`p-3 rounded-lg cursor-pointer transition ${bgClass} text-center font-medium`}
                        dangerouslySetInnerHTML={{ __html: ans }}
                        onClick={() => handleAnswerClick(ans)}
                      />
                    );
                  })}
                </ul>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 w-full transition"
                >
                  Next Question
                </button>
              </>
            )}
            {message && <p className="mt-4 text-red-400 text-center">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
