// src/api.js
export async function getMentorAdvice(answers, meta) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/mentor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers, meta }),
    });

    const data = await response.json();
    if (data.ok) {
      return data.result;
    } else {
      console.error("Backend error:", data.error);
      return null;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}
