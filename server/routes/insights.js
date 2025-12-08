const express = require("express");
const router = express.Router();
const Insight = require("../models/Insight");

// Get insights for a user
router.get("/:userId", async (req, res) => {
  try {
    const insights = await Insight.find({
      relatedPlayer: req.params.userId,
    }).sort({ date: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create an insight
router.post("/", async (req, res) => {
  try {
    const { title, description, type, relatedPlayer } = req.body;
    const newInsight = new Insight({
      title,
      description,
      type,
      relatedPlayer,
    });
    const insight = await newInsight.save();
    res.json(insight);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
