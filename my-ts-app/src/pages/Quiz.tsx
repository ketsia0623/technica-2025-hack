import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import "./Quiz.css"; // make sure Quiz.css is in the same folder
import Header from "../components/header";
import Footer from "../components/footer";

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
  const [answers, setAnswers] = useState<Record<number, number | null>>(
    () =>
      questions.reduce((acc, q) => {
        acc[q.id] = null;
        return acc;
      }, {} as Record<number, number | null>)
  );

  const [showSummary, setShowSummary] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = Object.values(answers).every((v) => v !== null);

  async function sendToMentor(
    answersPayload: Record<number, number | null>,
    meta: Record<string, any> = {}
  ) {
    const body = { answers: answersPayload, meta };

    const resp = await fetch("/api/ai/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Server error: ${resp.status} ${txt}`);
    }

    const data = await resp.json();
    // expect { ok: true, result: {...} } from the server example earlier
    if (!data.ok) {
      throw new Error(data.error || "AI endpoint returned an error");
    }
    return data.result;
  }

  // This handler is used by the main Submit button.
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // show summary panel
      setShowSummary(true);

      // call backend (this will be proxied to http://localhost:5000 in dev)
      const result = await sendToMentor(answers, {
        // optional metadata you can send (example)
        userAgent: navigator.userAgent,
      });

      // Save parsed AI result in state to render
      setAiResult(result);
    } catch (err: any) {
      console.error("sendToMentor error", err);
      setError(err.message || "Unknown error");
      setAiResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Optional: separate button inside the summary to (re)send to mentor.
  const handleSendFromSummary = async () => {
    // If we've already got aiResult, clicking can re-generate (or you can skip)
    await handleSubmit();
  };

  const handleReset = () => {
    setAnswers(
      questions.reduce((acc, q) => {
        acc[q.id] = null;
        return acc;
      }, {} as Record<number, number | null>)
    );
    setShowSummary(false);
    setAiResult(null);
    setError(null);
  };

  return (
    <div className="quiz-page">
      <Header />
      <div className="quiz-container">
        <div className="quiz-card">
          <header>
            <h1 className="quiz-title">Financial Familiar — Quick Quiz</h1>
            <p className="quiz-subtitle">
              Answer these to personalize your Financial Mentor & simulation.
            </p>
          </header>

          <div className="quiz-meta">
            <div className="quiz-stats">
              Questions: {questions.length} • Answered:{" "}
              {Object.values(answers).filter((v) => v !== null).length}
            </div>
            <div className="quiz-tip">Tip: Your choices will feed the AI Mentor</div>
          </div>

          {/* Questions area - will scroll if many */}
          <div className="quiz-questions-wrapper">
            {questions.map((q) => (
              <div key={q.id} className="quiz-question-box">
                <div className="quiz-question-header">
                  <h3 className="quiz-question">{q.question}</h3>
                  <div className="quiz-qid">#{q.id}</div>
                </div>

                <div className="quiz-options">
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <label
                        key={i}
                        className={`quiz-option ${selected ? "selected" : ""}`}
                        onClick={() => handleSelect(q.id, i)}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={selected || false}
                          readOnly
                          className="quiz-option-input"
                        />
                        <span className="quiz-option-text">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="quiz-footer">
            <div className="quiz-status">
              {allAnswered ? (
                <span className="quiz-all-done">All questions answered</span>
              ) : (
                <span className="quiz-partial">
                  Some questions left — I’ll still accept partial answers
                </span>
              )}
            </div>

            <div className="quiz-actions">
              <button
                className="quiz-reset"
                onClick={handleReset}
                disabled={loading}
                aria-disabled={loading}
              >
                Reset
              </button>

              <button
                className={`quiz-button ${allAnswered ? "" : "quiz-button-partial"}`}
                onClick={handleSubmit}
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? "Generating..." : allAnswered ? "Submit & Generate Plan" : "Submit (Partial)"}
              </button>
            </div>
          </div>

          {/* Summary panel */}
          {showSummary && (
            <div className="quiz-summary">
              <h4 className="quiz-summary-title">Summary of your answers</h4>
              <ul className="quiz-summary-list">
                {questions.map((q) => {
                  const selIndex = answers[q.id];
                  return (
                    <li key={q.id} className="quiz-summary-item">
                      <div className="quiz-summary-id">#{q.id}</div>
                      <div>
                        <div className="quiz-summary-question">{q.question}</div>
                        <div className="quiz-summary-answer">
                          {selIndex !== null ? (
                            q.options[selIndex]
                          ) : (
                            <i className="quiz-no-answer">No answer</i>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="quiz-summary-actions">
                {/* This button now triggers the actual AI call — or re-run it */}
                <button
                  className="quiz-send-mentor"
                  onClick={handleSendFromSummary}
                  disabled={loading}
                >
                  {loading ? "Generating…" : aiResult ? "Regenerate Plan" : "Send to AI Mentor"}
                </button>
              </div>

              {/* Loading / Error / AI result */}
              <div style={{ marginTop: 16 }}>
                {loading && <div className="quiz-ai-loading">Generating plan…</div>}

                {error && (
                  <div className="quiz-ai-error" style={{ color: "crimson", marginTop: 8 }}>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {aiResult && (
                  <div className="quiz-ai-result" style={{ marginTop: 12 }}>
                    {/* If your server returns structured JSON with keys */}
                    {aiResult.summary && (
                      <div style={{ marginBottom: 8 }}>
                        <strong>Summary:</strong> {aiResult.summary}
                      </div>
                    )}

                    {Array.isArray(aiResult.top_actions) && (
                      <div style={{ marginBottom: 8 }}>
                        <strong>Top actions:</strong>
                        <ul>
                          {aiResult.top_actions.map((a: any, idx: number) => (
                            <li key={idx}>
                              <strong>{a.title}</strong>: {a.description}
                              {typeof a.monthly_savings === "number" && (
                                <> — save ${a.monthly_savings}/mo</>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(aiResult.two_step_lesson) && (
                      <div style={{ marginBottom: 8 }}>
                        <strong>Two-step lesson:</strong>
                        <ol>
                          {aiResult.two_step_lesson.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* fallback display if server returned raw/unknown shape */}
                    {!aiResult.summary &&
                      !aiResult.top_actions &&
                      !aiResult.two_step_lesson && (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(aiResult, null, 2)}
                        </pre>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
