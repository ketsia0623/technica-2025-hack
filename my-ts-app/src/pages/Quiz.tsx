import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import "./Quiz.css"; 
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
    options: ["Bus Pass — $40/mo", "Used Car — $300/mo + gas", "Rideshare — $120/week"],
  },
  {
    id: 3,
    question: "It’s Friday night — what’s the move?",
    options: ["Cook at home — $12", "One night out — $45", "Full night out — $95"],
  },
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
    try {
      const body = { answers: answersPayload, meta };
      const resp = await fetch("http://localhost:5000/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Server error: ${resp.status} ${txt}`);
      }

      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || "AI endpoint returned an error");

      return data.result;
    } catch (err: any) {
      console.error("sendToMentor error", err);
      throw err;
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      setShowSummary(true);
      const result = await sendToMentor(answers, { userAgent: navigator.userAgent });
      setAiResult(result);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setAiResult(null);
    } finally {
      setLoading(false);
    }
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

      <div className="quiz-container" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
        {/* White box that you liked */}
        <div className="quiz-card" style={{ width: "100%", maxWidth: 760, background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(20,20,30,0.06)", padding: 20 }}>
          <header style={{ marginBottom: 12 }}>
            <h1 className="quiz-title" style={{ margin: 0, fontSize: 20 }}>Financial Familiar — Quick Quiz</h1>
            <p className="quiz-subtitle" style={{ marginTop: 6, color: "#6b7280", fontSize: 13 }}>Answer these to personalize your Financial Mentor & simulation.</p>
          </header>

          <div className="quiz-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="quiz-stats" style={{ color: "#374151", fontSize: 13 }}>
              Questions: {questions.length} • Answered: {Object.values(answers).filter((v) => v !== null).length}
            </div>
            <div className="quiz-tip" style={{ color: "#9CA3AF", fontSize: 12 }}>Tip: Your choices will feed the AI Mentor</div>
          </div>

          {/* Questions list - each separated by a small line */}
          <div className="quiz-questions-wrapper" style={{ marginTop: 8 }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="quiz-question-box" style={{ padding: "12px 6px" }}>
                <div className="quiz-question-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <h3 className="quiz-question" style={{ margin: 0, fontSize: 15 }}>{q.question}</h3>
                  <div className="quiz-qid" style={{ color: "#9CA3AF", fontSize: 12 }}>#{q.id}</div>
                </div>

                <div className="quiz-options" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <label
                        key={i}
                        className={`quiz-option ${selected ? "selected" : ""}`}
                        onClick={() => handleSelect(q.id, i)}
                        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={selected || false}
                          readOnly
                          className="quiz-option-input"
                          style={{ width: 16, height: 16 }}
                        />
                        <span className="quiz-option-text" style={{ color: "#111827", fontSize: 14 }}>{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {/* small subtle separator line, omit after last question */}
                {idx < questions.length - 1 && (
                  <div style={{ height: 1, background: "linear-gradient(90deg, rgba(209,213,219,0) 0%, rgba(209,213,219,1) 50%, rgba(209,213,219,0) 100%)", marginTop: 12 }} />
                )}
              </div>
            ))}
          </div>

          <div className="quiz-footer" style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="quiz-status" style={{ color: "#374151", fontSize: 13 }}>
              {allAnswered ? (
                <span className="quiz-all-done" style={{ color: "#059669" }}>All questions answered</span>
              ) : (
                <span className="quiz-partial">Some questions left — I’ll still accept partial answers</span>
              )}
            </div>

            <div className="quiz-actions" style={{ display: "flex", gap: 8 }}>
              <button
                className="quiz-reset"
                onClick={handleReset}
                disabled={loading}
                aria-disabled={loading}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "white", cursor: loading ? "not-allowed" : "pointer" }}
              >
                Reset
              </button>

              <button
                className={`quiz-button ${allAnswered ? "" : "quiz-button-partial"}`}
                onClick={handleSubmit}
                disabled={loading}
                aria-disabled={loading}
                style={{ padding: "8px 14px", borderRadius: 8, background: allAnswered ? "#1F2937" : "#374151", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Generating..." : allAnswered ? "Submit & Generate Plan" : "Submit (Partial)"}
              </button>
            </div>
          </div>

          {/* Summary panel - keep minimal formatting */}
          {showSummary && (
            <div className="quiz-summary" style={{ marginTop: 18, borderTop: "1px solid #F3F4F6", paddingTop: 12 }}>
              <h4 className="quiz-summary-title" style={{ margin: 0, fontSize: 16 }}>Summary of your answers</h4>
              <ul className="quiz-summary-list" style={{ listStyle: "none", padding: 0, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {questions.map((q) => {
                  const selIndex = answers[q.id];
                  return (
                    <li key={q.id} className="quiz-summary-item" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div className="quiz-summary-id" style={{ color: "#9CA3AF", fontSize: 12 }}>#{q.id}</div>
                      <div>
                        <div className="quiz-summary-question" style={{ fontSize: 14, color: "#111827" }}>{q.question}</div>
                        <div className="quiz-summary-answer" style={{ marginTop: 4, color: selIndex !== null ? "#374151" : "#9CA3AF", fontSize: 13 }}>
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

              <div className="quiz-summary-actions" style={{ marginTop: 12 }}>
                <button className="quiz-send-mentor" onClick={handleSubmit} disabled={loading} style={{ padding: "8px 12px", borderRadius: 8, background: "#111827", color: "white", border: "none" }}>
                  {loading ? "Generating…" : aiResult ? "Regenerate Plan" : "Send to AI Mentor"}
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                {loading && <div className="quiz-ai-loading">Generating plan…</div>}

                {error && (
                  <div className="quiz-ai-error" style={{ color: "crimson", marginTop: 8 }}>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {aiResult && (
                  <div className="quiz-ai-result" style={{ marginTop: 12 }}>
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
                              {typeof a.monthly_savings === "number" && <> — save ${a.monthly_savings}/mo</>}
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

                    {!aiResult.summary && !aiResult.top_actions && !aiResult.two_step_lesson && (
                      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(aiResult, null, 2)}</pre>
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
