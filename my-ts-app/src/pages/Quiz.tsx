import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import "./Quiz.css";



type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "Where do you want to live this semester?",
    options: [
      "Apt A — $650/mo, 40-min commute",
      "Apt B — $900/mo, 20-min commute",
      "Apt C — $1,300/mo, 5-min commute + amenities",
    ],
  },
  {
    id: 2,
    question: "How will you get around?",
    options: [
      "Bus Pass — $40/mo",
      "Used Car — $300/mo + gas",
      "Rideshare — $120/week",
    ],
  },
  {
    id: 3,
    question: "It’s Friday night — what’s the move?",
    options: [
      "Cook at home — $12",
      "One night out — $45",
      "Full night out — $95",
    ],
  },
  // Add the rest of your questions here...
];

export default function QuizPage(): JSX.Element {
  // answers: map questionId -> selected option index (0-based)
  const [answers, setAnswers] = useState<Record<number, number | null>>(
    () =>
      questions.reduce((acc, q) => {
        acc[q.id] = null;
        return acc;
      }, {} as Record<number, number | null>)
  );

  const [showSummary, setShowSummary] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = Object.values(answers).every((v) => v !== null);

  const handleSubmit = () => {
    // Replace with any scoring / API call you want
    setShowSummary(true);
    // e.g., call AI with parsed answers here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      {/* Center card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <h1 className="text-2xl font-semibold">Financial Familiar — Quick Quiz</h1>
          <p className="text-sm opacity-90 mt-1">
            Answer these to personalize your Financial Mentor & simulation.
          </p>
        </div>

        {/* Content area: two-column layout on md+ */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {`Questions: ${questions.length} • Answered: ${
                Object.values(answers).filter((v) => v !== null).length
              }`}
            </div>
            <div className="text-sm text-gray-500">Tip: Your choices will feed the AI Mentor</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-auto pr-2">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-medium text-gray-800">{q.question}</h3>
                  <div className="text-xs text-gray-500">#{q.id}</div>
                </div>

                <div className="mt-4 space-y-3">
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 w-full cursor-pointer p-3 rounded-xl border transition
                          ${
                            selected
                              ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-100"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={selected || false}
                          onChange={() => handleSelect(q.id, i)}
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <div className="text-sm text-gray-800">{opt}</div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer with actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {allAnswered ? (
                <span className="text-green-600 font-medium">All questions answered</span>
              ) : (
                <span className="text-yellow-600">Some questions left — I’ll still accept partial answers</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // quick clear (optional)
                  setAnswers(
                    questions.reduce((acc, q) => {
                      acc[q.id] = null;
                      return acc;
                    }, {} as Record<number, number | null>)
                  );
                  setShowSummary(false);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                onClick={handleSubmit}
                className={`px-5 py-2 rounded-xl text-sm text-white transition
                  ${allAnswered ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400/80 cursor-pointer"}
                `}
              >
                {allAnswered ? "Submit & Generate Plan" : "Submit (Partial)"}
              </button>
            </div>
          </div>

          {/* Summary panel */}
          {showSummary && (
            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-inner">
              <h4 className="text-lg font-semibold mb-3">Summary of your answers</h4>
              <ul className="space-y-2">
                {questions.map((q) => {
                  const selIndex = answers[q.id];
                  return (
                    <li key={q.id} className="flex gap-4 items-start">
                      <div className="w-6 text-xs text-gray-500">#{q.id}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{q.question}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {selIndex !== null ? q.options[selIndex] : <span className="italic text-gray-400">No answer</span>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    // hook point: call LLM / API with answers here
                    alert("Here you'd call your AI Mentor with the selected answers (demo)");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  Send to AI Mentor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
