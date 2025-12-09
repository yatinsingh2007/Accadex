const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
// Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message, videoUrl, role = "ai_coach" } = req.body;

    // Check for API Key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Using partial mock response.");
      return res.json({
        response:
          "I'm currently running in demo mode because my AI brain (API Key) is missing. Please add GEMINI_API_KEY to the server .env file to unlock my full potential!",
      });
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    let systemInstruction = "";

    switch (role) {
      case "physician":
        systemInstruction =
          "You are Dr. Sarah, a sports physician. Provide advice on injury prevention, recovery, and physical health for athletes. Keep it professional but accessible.";
        break;
      case "head_coach":
        systemInstruction =
          "You are Coach Mike, a tough but encouraging head coach. Focus on strategy, discipline, teamwork, and match performance. Use coaching terminology.";
        break;
      case "nutritionist":
        systemInstruction =
          "You are Lisa, a sports nutritionist. Advise on diet, hydration, meal planning, and fueling for performance. Be specific about food types.";
        break;
      case "ai_coach":
      default:
        systemInstruction =
          "You are an advanced AI Sports Coach. Analyze user inputs regarding sports performance, technique, and strategy. Provide data-driven and tactical advice.";
        break;
    }

    // specific prompt construction
    let prompt = `${systemInstruction}\n\nUser: ${message}`;
    if (videoUrl) {
      prompt += `\n[System Note: User uploaded a video at ${videoUrl}. Since I cannot see videos yet, acknowledge the upload and give general advice based on the context provided in the message.]`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res
      .status(500)
      .json({
        response:
          "Sorry, I'm having trouble connecting to the AI service right now.",
      });
  }
});

module.exports = router;
