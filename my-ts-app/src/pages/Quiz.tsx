import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
};

export default function Quiz() {
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
      options: ["Cook at home — $12", "One night out — $45", "Full night out — $95"],
    },
  ];

  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [current]: option });
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">
            Question {current + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold mb-4">
          {questions[current].question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {questions[current].options.map((option: string) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${
                  answers[current] === option
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          {current < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              disabled={!answers[current]}
            >
              Next
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              disabled={!answers[current]}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
