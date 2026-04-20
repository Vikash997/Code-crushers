let lastMemoryId = null;
function formatAIResponse(text) {
  return text
    .replace(/(\d+\.)/g, "\n$1")
    .replace(/\n+/g, "\n")
    .trim();
}

import { sendQuery } from "./api.js";
import { updateMemoryPanel } from "./memory.js";
import { addFeedbackButtons } from "./feedback.js";

function getBestMemory(memories) {
  if (!memories || memories.length === 0) return null;

  //ONLY show successful ones
  return memories.find(m => m.success === true) || null;
}

export function initChat() {
  console.log("initChat running...");

  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("input");

  if (!sendBtn || !input) {
    console.error("Input or button not found!");
    return;
  }

  sendBtn.addEventListener("click", () => {
    console.log("Send button clicked");
    handleSend();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter pressed");
      handleSend();
    }
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
        🔁 Learned from ${memories.length} similar cases
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
    lastMemoryId = data.memoryId;
    const formattedReply = formatAIResponse(data.reply).replace(/\n/g, "<br>");

    addMessage("AI", formattedReply, data.memories || []);

    //Show best memory
    const best = getBestMemory(data.memories);

    if (best) {
      addMessage(
        "AI",
        `💡 Top Past Fix:<br>${best.fix}<br>
        <span style="color: ${best.success ? 'lightgreen' : 'red'}">
          ${best.success ? '✔ Worked before' : '❌ Not successful'}
        </span>`
      );
    }

    updateMemoryPanel(data.memories || []);
    addFeedbackButtons(lastMemoryId);

  } catch (err) {
    console.error("Chat error:", err);
    addMessage("AI", "⚠️ Failed to get response. Try again.");
  }
}