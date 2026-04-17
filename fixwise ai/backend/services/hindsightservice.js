import axios from "axios";

const BASE = process.env.HINDSIGHT_BASE_URL;
const API_KEY = process.env.HINDSIGHT_API_KEY;

let lastMemoryId = null;

// 🔍 Search similar incidents
export async function searchMemory(query) {
  try {
    const res = await axios.post(
      `${BASE}/search`,
      { query, top_k: 3 },
      {
        headers: { Authorization: `Bearer ${API_KEY}` }
      }
    );

    return res.data.results.map(r => ({
      issue: r.metadata.issue,
      fix: r.metadata.fix,
      success: r.metadata.success
    }));

  } catch (err) {
    console.log("Hindsight search fallback");
    return [];
  }
}

// 💾 Store new memory
export async function storeMemory(data) {
  try {
    const res = await axios.post(
      `${BASE}/store`,
      {
        text: data.issue,
        metadata: data
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` }
      }
    );

    lastMemoryId = res.data.id;

  } catch (err) {
    console.log("Hindsight store failed");
  }
}

// 👍 Update feedback
export async function updateLastMemory(helpful) {
  if (!lastMemoryId) return;

  try {
    await axios.post(
      `${BASE}/update`,
      {
        id: lastMemoryId,
        metadata: { success: helpful }
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` }
      }
    );
  } catch {
    console.log("Feedback update failed");
  }
}