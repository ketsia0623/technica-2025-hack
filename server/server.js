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
const GEMINI_MODEL = process.env.GEMINI_MODEL || "text-bison-001";

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const payload = {
    prompt: [
        {
        text: promptText
        }
    ],
    temperature: 0.2,
    candidateCount: 1,
    maxOutputTokens: 500
    };


    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
    });

    // parse response
    const text =
      response.data?.candidates?.[0]?.content?.[0]?.text ||
      response.data?.candidates?.[0]?.output ||
      JSON.stringify(response.data);

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
