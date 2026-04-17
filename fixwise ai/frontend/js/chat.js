import { sendQuery } from "./api.js";
import { updateMemoryPanel } from "./memory.js";
import { addFeedbackButtons } from "./feedback.js";

export function initChat() {
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("input");

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });
}

function addMessage(role, text, memories = []) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = "bg-gray-700 p-3 rounded-xl";

  let memoryInfo = "";
  if (memories.length > 0) {
    memoryInfo = `
      <div class="mt-2 text-green-400 text-sm">
        🔁 Based on ${memories.length} past incidents
      </div>
    `;
  }

  div.innerHTML = `<strong>${role}:</strong> ${text} ${memoryInfo}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function handleSend() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  addMessage("User", text);
  input.value = "";

  try {
    const data = await sendQuery(text);

    addMessage("AI", data.reply, data.memories || []);
    updateMemoryPanel(data.memories || []);
    addFeedbackButtons();

  } catch {
    addMessage("AI", "⚠️ Error connecting to server");
  }
}