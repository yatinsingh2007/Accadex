const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, videoUrl, role = "ai_coach" } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing");
      return res.json({
        response:
          "AI is running in demo mode. Please configure GEMINI_API_KEY.",
      });
    }

    let systemInstruction = "";

    switch (role) {
      case "physician":
        systemInstruction =
          "You are Dr. Sarah, a sports physician. Provide injury prevention and recovery advice.";
        break;
      case "head_coach":
        systemInstruction =
          "You are Coach Mike, a strict but motivating head coach. Focus on tactics and discipline.";
        break;
      case "nutritionist":
        systemInstruction =
          "You are Lisa, a sports nutritionist. Give diet and hydration advice.";
        break;
      case "ai_coach":
      default:
        systemInstruction =
          "You are an advanced AI Sports Coach. Provide technical and performance feedback.";
        break;
    }

    let prompt = `${systemInstruction}\n\nUser: ${message}`;

    if (videoUrl) {
      prompt += `\n\n[System Note: The user uploaded a video at ${videoUrl}. You cannot directly view it, so acknowledge and give general guidance based on the message.]`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // Extract text from the response structure
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return res.json({ response: text });
  } catch (err) {
    console.error("Gemini API Error:", err?.message || err);

    return res.status(500).json({
      response:
        "AI service is temporarily unavailable. Please try again shortly.",
    });
  }
});

module.exports = router;
