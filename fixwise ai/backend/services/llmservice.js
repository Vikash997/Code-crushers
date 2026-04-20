import axios from "axios";

export async function generateResponse(query, memories) {
  const lowerQuery = query.toLowerCase().trim();

  //Greeting detection (only exact greetings)
  const isGreeting = ["hi", "hello", "hey"].includes(lowerQuery);

  if (isGreeting) {
    return "Hi! 👋 How can I help you today?";
  }

  // Optional: small talk handling
  if (lowerQuery.includes("how are you")) {
    return "I'm doing great! 😊 Ready to help you fix any DevOps issue.";
  }

  // Prepare memory context (top 3 only)
  let context = "";

const goodMemories = memories
  .filter(m => m.success === true)
  .slice(0, 2);

if (goodMemories.length > 0) {
  context = "Previously successful fixes:\n";

  goodMemories.forEach((m, i) => {
    context += `${i + 1}. ${m.fix}\n`;
  });
}
  if (memories && memories.length > 0) {
    context = memories
      .slice(0, 3)
      .map((m, i) => {
        return `${i + 1}. Issue: ${m.issue} | Fix: ${m.fix} | Success: ${m.success}`;
      })
      .join("\n");
  }

  // AI prompt
  const messages = [
    {
      role: "system",
      content: `You are FixWise AI, a friendly DevOps assistant.

Rules:
- Be conversational and helpful
- Start with a short greeting when appropriate
- Understand the user's intent before responding
- For technical issues → give 3 clear steps
- Keep answers short and practical
- Prefer commands or actionable steps
- Avoid robotic or repetitive responses

Examples:

User: hi
AI: Hi! 👋 How can I help you today?

User: docker not working
AI: Hi! 👋 Let's fix that. Try these steps:
1. Check Docker service status → systemctl status docker
2. Restart Docker → systemctl restart docker
3. Check logs → journalctl -u docker

User: server crashed
AI: Hey! 👋 Let's debug it:
1. Check logs → tail -f /var/log/syslog
2. Check CPU/memory → top
3. Restart service → systemctl restart your-service
`
    },
    {
      role: "user",
      content: `User query: ${query}

Past similar issues:
${context}`
    }
  ];

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages,
        max_tokens: 250,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return (
      res.data?.choices?.[0]?.message?.content?.trim() ||
      "⚠️ AI unavailable"
    );

  } catch (error) {
    console.error("GROQ Error:", error.response?.data || error.message);

    // ✅ Fallback response
    return `Hey! 👋 Let's try this:
1. Check logs for errors
2. Restart the service
3. Verify configuration`;
  }
}