import express from "express";
import { searchMemory, storeMemory } from "../services/hindsightService.js";
import { generateResponse } from "../services/llmService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query" });
  }

  let memories = [];

  try {
    memories = await searchMemory(query);
  } catch {
    memories = [];
  }

  let reply = "";

  try {
    reply = await generateResponse(query, memories);
  } catch {
    reply = "⚠️ AI failed to respond";
  }

  const memoryId = await storeMemory({
    issue: query,
    fix: reply,
    success: null
  }) || null;

  res.json({
    reply,
    memories,
    memoryId
  });
});

export default router;
