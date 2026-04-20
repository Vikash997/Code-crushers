import { HindsightClient } from '@vectorize-io/hindsight-client';
import {
  searchMemory as localSearch,
  storeMemory as localStore,
  updateLastMemory as localUpdate
} from "../store/memorystore.js";

const client = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL,
  apiKey: process.env.HINDSIGHT_API_KEY,
  bankId: "default"
});

const COLLECTION = "fixwise";

let lastMemoryId = null;

// 🔍 SEARCH MEMORY
export async function searchMemory(query) {
  try {
    const results = await client.recall(COLLECTION, query);

    return results
  .map((r) => {
    const meta = r.metadata || {};

    return {
      issue: meta.issue || r.content,
      fix: meta.fix || r.content,
      success: meta.success ?? null,
      id: r.id
    };
  })
  //remove empty
  .filter(m => m.issue && m.fix)
  //remove junk data (IMPORTANT)
  .filter(m => !m.issue.match(/actor|iit|semester|movie/i));

  } catch (err) {
    console.error("Hindsight recall error:", err.message);
    console.log("Using local fallback...");
    return localSearch(query);
  }
}


// 💾 STORE MEMORY
export async function storeMemory(data) {
  try {
    const res = await client.retain(COLLECTION, {
      content: `${data.issue} → ${data.fix}`, // 🔥 rich context
      metadata: {
        issue: data.issue,
        fix: data.fix,
        success: data.success,
        timestamp: Date.now()
      }
    });

    lastMemoryId = res.id; // 👈 store real ID
    return res.id;

  } catch (err) {
    console.error("Hindsight retain error:", err.message);

    const id = localStore(data);
    lastMemoryId = id;
    return id;
  }
}


// 🔁 UPDATE FEEDBACK (IMPORTANT)
export async function updateLastMemory(id, helpful) {
  try {
    if (!id) return;

    // ❗ Hindsight SDK doesn't support update yet
    // So we STORE a new improved memory instead

    await client.retain(COLLECTION, {
      content: `Feedback update`,
      metadata: {
        id,
        success: helpful,
        updated: true,
        timestamp: Date.now()
      }
    });

  } catch (err) {
    console.error("Hindsight update fallback:", err.message);
    localUpdate(id, helpful);
  }
}