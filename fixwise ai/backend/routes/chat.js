import express from "express";
import { searchMemory, storeMemory } from "../services/hindsightService.js";
import { generateResponse } from "../services/llmService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;

  try {
    // 🔍 1. Retrieve similar past incidents
    const memories = await searchMemory(query);

    // 🤖 2. Generate AI response using past memory
    const reply = await generateResponse(query, memories);

    // 🧠 3. Store new interaction (no feedback yet)
    await storeMemory({
      issue: query,
      fix: reply,
      success: null
    });

    res.json({
      reply,
      memories
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error processing request" });
  }
});

export default router;