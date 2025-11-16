// server/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
app.use(cors()); // you can lock this down to your CRA origin when deployed
app.use(bodyParser.json({ limit: "500kb" }));

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "models/gemini-1.0";

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment. See .env.example");
  process.exit(1);
}

/**
 * Helper: transform quiz answers into a prompt for Gemini
 * Customize prompt as you like.
 */
function buildPromptFromAnswers(payload) {
  const { answers = {}, meta = {} } = payload;
  const answerLines = Object.entries(answers)
    .map(([qid, idx]) => `Q${qid}: choice ${idx}`)
    .join("\n");

  const metaLines = Object.entries(meta)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return `
You are "Financial Mentor", a friendly, concise coach for college students.

User quiz answers:
${answerLines}

User meta:
${metaLines}

Produce a JSON object ONLY with the following keys:
{
  "summary": "one-line summary of the user's financial health",
  "top_actions": [
    {"title":"...", "description":"...", "monthly_savings": 50},
    ...
  ],
  "two_step_lesson": ["step1", "step2"]
}

If you cannot compute monthly_savings use null. Return strict valid JSON with no extra commentary.
`;
}

app.post("/api/ai/mentor", async (req, res) => {
  try {
    const body = req.body || {};
    // Build the prompt
    const prompt = buildPromptFromAnswers(body);

    // REST call to Generative Language API
    const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateText`;

    const payload = {
      // API expects contents array with parts text
      contents: [{ parts: [{ text: prompt }] }],
      // You can tune temperature / max output tokens here if supported by your model/version
      // e.g. temperature: 0.2,
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY, // server-side only
      },
    });

    // Response parsing depends on response shape. Commonly:
    // data.candidates[0].content.parts[0].text (or data.candidates[0].output)
    const data = response.data;
    // Try common locations:
    let text = "";
    if (data?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text) {
      text = data.candidates[0].content[0].parts[0].text;
    } else if (data?.candidates?.[0]?.output) {
      text = data.candidates[0].output;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    } else if (data?.reply?.output_text) {
      text = data.reply.output_text;
    } else {
      // fallback: stringify
      text = JSON.stringify(data);
    }

    // Try to parse JSON out of the text (since we ask for JSON)
    let jsonOut = null;
    try {
      jsonOut = JSON.parse(text);
    } catch (e) {
      // if the model didn't return pure JSON, return raw text too
      jsonOut = { raw: text };
    }

    res.json({ ok: true, result: jsonOut });
  } catch (err) {
    console.error("AI call error:", err?.response?.data || err.message || err);
    res.status(500).json({ ok: false, error: err?.response?.data || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

app.get("/test", async (req, res) => {
  res.json({ message: "Backend is running!" });
});

