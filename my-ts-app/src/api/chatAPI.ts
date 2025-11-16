type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};


export async function sendChatMessage(messages: ChatMessage[]) {
  const res = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  return data.reply;
}
