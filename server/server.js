// server.js

import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const systemPrompt = {
      role: "system",
      content: `
You are FINCOACH, an AI personal finance assistant for Gen Z.
Your job is to:
- analyze budgets
- identify overspending
- calculate savings plans
- explain financial concepts clearly
- create debt payoff strategies (avalanche & snowball)
- give step-by-step, technical advice
- ALWAYS return short, direct answers with numbers.

Rules:
- No fluff.
- Always explain why.
- Use math when applicable.
- If the user gives income, calculate a 50/30/20 budget.
- If the user mentions debt, ask for balances + interest rates.
`
    };

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        systemPrompt,
        ...messages   // ← only user + assistant messages from frontend
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat error" });
  }
});
