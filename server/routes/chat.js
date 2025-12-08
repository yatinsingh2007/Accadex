const express = require("express");
const router = express.Router();

// Mock AI Chat Endpoint
router.post("/", async (req, res) => {
  try {
    const { message, videoUrl, role = "ai_coach" } = req.body;

    // Simulate processing delay
    setTimeout(() => {
      let response = "";

      switch (role) {
        case "physician":
          response = "Dr. Sarah here. ";
          if (videoUrl)
            response +=
              "I see some strain in that movement. Be careful with your rotator cuff. ";
          else
            response += ` regarding "${message}", make sure to rest if you feel any pain. Hydration is key.`;
          break;
        case "head_coach":
          response = "Coach Mike speaking. ";
          if (videoUrl)
            response +=
              "Good intensity, but watch your footwork on the recovery. ";
          else
            response += ` "${message}"? We need to drill that in practice tomorrow. Keep your head up.`;
          break;
        case "nutritionist":
          response = "Hi, this is Lisa. ";
          if (videoUrl)
            response +=
              "Ensure you're fueling properly before high-intensity sessions like this. ";
          else
            response += ` regarding "${message}", let's look at your carb intake. Are you eating enough whole grains?`;
          break;
        case "ai_coach":
        default:
          response = "I analyzed your input. ";
          if (videoUrl)
            response +=
              "That serve technique looks fluid, but try to extend your arm more at the contact point. ";
          else
            response += `Regarding "${message}", focus on consistent practice and footwork.`;
          break;
      }

      res.json({ response });
    }, 1500);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
