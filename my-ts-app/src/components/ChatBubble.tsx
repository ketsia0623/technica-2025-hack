// src/components/ChatBubble.tsx
import { useState } from "react";
import { sendChatMessage } from "../api/chatAPI";

const SYSTEM_PROMPT = `
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
- Always explain “why”.
- Use math when applicable.
- If the user gives income, calculate a 50/30/20 budget.
- If the user mentions debt, ask for interest rates and balances.
`;


// Define message type
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
  { role: "system", content: SYSTEM_PROMPT }
  ]);


  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function ruleEngine(input: string): string | null {
    const lower = input.toLowerCase();

    if (lower.includes("overspent") || lower.includes("over budget")) {
      return "Which category do you want help analyzing? I can break down your spending and suggest fixes.";
    }

    if (lower.includes("budget")) {
      return "What's your monthly income? I can calculate a 50/30/20 budget for you.";
    }

    if (lower.includes("save") || lower.includes("savings")) {
      return "What's your current income and how much do you want to save? I can project your timeline.";
    }

    if (lower.includes("debt") || lower.includes("credit card") || lower.includes("interest")) {
      return "Give me your debt balances + interest rates, and I'll create an avalanche vs snowball plan.";
    }

    return null;
  }



  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // 🔥 Run the rule engine BEFORE calling your backend  
    const ruleResponse = ruleEngine(input);
    if (ruleResponse) {
      setMessages([...newMessages, { role: "assistant", content: ruleResponse }]);
      setLoading(false);
      return;
    }

    try {
      const reply = await sendChatMessage(newMessages);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Error: Try again later." }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4F46E5",
          color: "white",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        💬
      </button>

      {/* Popup Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "400px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px", fontWeight: "bold" }}>
            Financial Coach
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "8px", textAlign: m.role === "user" ? "right" : "left" }}>
                <span
                  style={{
                    backgroundColor: m.role === "user" ? "#E0E7FF" : "#F3F4F6",
                    padding: "6px 10px",
                    borderRadius: "12px",
                    display: "inline-block",
                    maxWidth: "80%",
                    wordWrap: "break-word"
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <div>💬 typing...</div>}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "10px", border: "none", outline: "none" }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                padding: "0 15px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
