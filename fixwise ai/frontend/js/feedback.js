import { sendFeedback } from "./api.js";

export function addFeedbackButtons() {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = "flex gap-2 mt-2";

  const up = document.createElement("button");
  up.innerText = "👍 Helpful";
  up.className = "bg-green-600 px-3 py-1 rounded";
  up.onclick = () => handleFeedback(true);

  const down = document.createElement("button");
  down.innerText = "👎 Not Helpful";
  down.className = "bg-red-600 px-3 py-1 rounded";
  down.onclick = () => handleFeedback(false);

  div.appendChild(up);
  div.appendChild(down);
  chat.appendChild(div);
}

async function handleFeedback(value) {
  await sendFeedback(value);
  alert("Feedback recorded!");
}