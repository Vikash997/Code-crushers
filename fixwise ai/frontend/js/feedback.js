import { sendFeedback } from "./api.js";

export function addFeedbackButtons(memoryId) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = "flex gap-2 mt-2";

  const up = document.createElement("button");
  up.innerText = "👍 Helpful";
  up.className = "bg-green-600 px-3 py-1 rounded";
  up.onclick = () => handleFeedback(true, memoryId);

  const down = document.createElement("button");
  down.innerText = "👎 Not Helpful";
  down.className = "bg-red-600 px-3 py-1 rounded";
  down.onclick = () => handleFeedback(false, memoryId);

  div.appendChild(up);
  div.appendChild(down);
  chat.appendChild(div);
}

async function handleFeedback(value, memoryId) {
  try {
    await sendFeedback(value, memoryId); // from api.js
    alert("🧠 Learning from your feedback...");
  } catch (err) {
    console.error("Feedback error:", err);
  }
}
