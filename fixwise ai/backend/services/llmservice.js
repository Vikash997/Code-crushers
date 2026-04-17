import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function generateResponse(query, memories) {

  let context = "";

  if (memories.length > 0) {
    context = "Past similar incidents:\n";
    memories.forEach((m, i) => {
      context += `${i + 1}. Issue: ${m.issue} | Fix: ${m.fix} | Success: ${m.success}\n`;
    });
  }

  const prompt = `
You are a DevOps AI assistant.

${context}

User issue: ${query}

Give the best possible solution. Prefer solutions that worked before.
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "qwen/qwen3-32b",
      messages: [
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
}