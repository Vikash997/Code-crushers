import express from "express";
import { updateLastMemory } from "../services/hindsightService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { helpful, memoryId } = req.body;

  try {
    await updateLastMemory(memoryId, helpful);
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: "Feedback failed" });
  }
});

export default router;