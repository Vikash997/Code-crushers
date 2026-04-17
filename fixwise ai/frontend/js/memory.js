export function updateMemoryPanel(memories) {
  const panel = document.getElementById("memoryPanel");
  panel.innerHTML = "";

  if (!memories.length) {
    panel.innerHTML = "<p>No similar incidents found.</p>";
    return;
  }

  memories.forEach((m) => {
    const div = document.createElement("div");
    div.className = "bg-gray-700 p-2 rounded";

    div.innerHTML = `
      <div><strong>Issue:</strong> ${m.issue}</div>
      <div><strong>Fix:</strong> ${m.fix}</div>
      <div class="text-xs text-green-400">
        Success: ${m.success ? "✔️" : "❌"}
      </div>
    `;

    panel.appendChild(div);
  });
}