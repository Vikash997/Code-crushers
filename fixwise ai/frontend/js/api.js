const API_BASE = "http://127.0.0.1:5000";

export async function sendQuery(query) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    return await res.json();

  } catch (err) {
    console.error("API Error:", err);
    throw err; // important
  }
}

export async function sendFeedback(helpful, memoryId) {
  await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ helpful, memoryId })
  });
}