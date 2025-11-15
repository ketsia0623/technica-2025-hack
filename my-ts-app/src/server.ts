// server.ts
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai"; // official SDK per quickstart

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Please set GEMINI_API_KEY in your environment");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // SDK reads env or explicit

// endpoint that accepts quiz answers
app.post("/api/ai/mentor", async (req, res) => {
  try {
    const answers = req.body; // expected: { answers: { "1": 0, "2": 2, ... }, meta: {...} }
    // transform answers into a friendly prompt or structured data
    const prompt = buildPromptFromAnswers(answers);

    // call Gemini (example uses gemini-2.5-flash per quickstart)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // response.text or candidates depend on SDK version — use the SDK's documented property
    const text = response.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    res.json({ ok: true, mentorText: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

function buildPromptFromAnswers(payload: any) {
  // Example structure — customize to your needs
  // We'll provide a structured prompt below you can copy
  const answers = payload.answers ?? {};
  const lines = ["You are a friendly, actionable financial mentor. Analyze the user quiz below and produce:"];
  lines.push("- A one-sentence financial health summary");
  lines.push("- 3 prioritized action items with estimated monthly $ impact if applicable");
  lines.push("- A short 2-step lesson they can follow this week");
  lines.push("");
  lines.push("User quiz answers (id -> choice index):");
  for (const [qid, idx] of Object.entries(answers)) {
    lines.push(`${qid}: ${String(idx)}`);
  }
  lines.push("");
  lines.push("Be concise and return plain text. Use bullet points.");
  return lines.join("\n");
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
