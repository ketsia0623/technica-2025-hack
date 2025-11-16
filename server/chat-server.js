// server/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(cors()); // you can restrict to your CRA origin in production
app.use(bodyParser.json({ limit: "500kb" }));

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment. See .env");
  process.exit(1);
}

/**
 * Helper: turn quiz answers into a prompt for Gemini
 */
function buildPromptFromAnswers({ answers = {}, meta = {} }) {
  const answerLines = Object.entries(answers)
    .map(([qid, idx]) => `Q${qid}: choice ${idx}`)
    .join("\n");

  const metaLines = Object.entries(meta)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return `You are "Financial Mentor", a friendly, concise coach for college students.

User quiz answers:
${answerLines}

User meta:
${metaLines}

Produce a JSON object ONLY with the following keys:
{
  "summary": "one-line summary of the user's financial health",
  "top_actions": [
    {"title":"...","description":"...","monthly_savings":50}
  ],
  "two_step_lesson":["step1","step2"]
}

Return valid JSON only. No extra commentary. If monthly_savings cannot be computed, use null.`;
}

/**
 * AI endpoint
 */
app.post("/api/ai/mentor", async (req, res) => {
  try {
    const body = req.body || {};
    const promptText = buildPromptFromAnswers(body);

    //const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const payload = {
        contents: [
            {
            parts: [
                {
                text: promptText
                }
            ]
            }
        ],
        generationConfig: {
            temperature: 0.15,
            topP: 0.95,
            topK: 40,
            candidateCount: 1,
            maxOutputTokens: 2000
        }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const response = await axios.post(url, payload, {
    headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    },
    });


    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(response.data);



    let jsonOut = null;
    try {
      jsonOut = JSON.parse(text);
    } catch (e) {
      jsonOut = { raw: text };
    }

    res.json({ ok: true, result: jsonOut });
  } catch (err) {
    console.error("AI call error:", err?.response?.data || err.message || err);
    res.status(500).json({ ok: false, error: err?.response?.data || String(err) });
  }

  /** Helper: simple local fallback that produces a reasonable JSON from the answers */
    function buildFallbackFromAnswers(answers) {
    // simplistic heuristics — customize to match your scenarios
    const summary = "We couldn't get a full AI plan; here is a quick local suggestion.";
    const top_actions = [];
    // example rules: if user picked expensive apartment (choice 2) recommend saving
    if (answers[1] === 2) {
        top_actions.push({
        title: "Consider cheaper housing",
        description: "Your housing choice is expensive; move to a cheaper option or get a roommate.",
        monthly_savings: 400
        });
    }
    if (answers[3] === 0) {
        top_actions.push({
        title: "Cook more",
        description: "Cooking at home saves money compared to nights out.",
        monthly_savings: 80
        });
    }
    if (top_actions.length === 0) {
        top_actions.push({
        title: "Track your spending",
        description: "Start tracking expenses for two weeks to find easy cuts.",
        monthly_savings: null
        });
    }
    const two_step_lesson = ["Track all spending for 2 weeks", "Set a simple monthly budget and automate $50 to savings"];
    return { summary, top_actions, two_step_lesson };
    }
});

/**
 * Simple test route
 */
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});





