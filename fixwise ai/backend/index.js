import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoute from "./routes/chat.js";
import feedbackRoute from "./routes/feedback.js";

dotenv.config();

//Debug logs
console.log("PORT:", process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);
app.use("/feedback", feedbackRoute);

// ✅ Safe fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});