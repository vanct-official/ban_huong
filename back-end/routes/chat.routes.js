// back-end/routes/chat.routes.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // đặt trong .env
});

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là AI hỗ trợ khách hàng của Vinsaky Shop.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ Lỗi ChatGPT:", err);
    res.status(500).json({ error: "Không thể kết nối AI" });
  }
});

export default router;
