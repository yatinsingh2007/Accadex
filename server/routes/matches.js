const express = require("express");
const router = express.Router();
const Match = require("../models/Match");

// Get all matches for a user
router.get("/:userId", async (req, res) => {
  try {
    const matches = await Match.find({ player: req.params.userId }).sort({
      date: -1,
    });
    res.json(matches);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a match result
router.post("/", async (req, res) => {
  try {
    const { opponent, result, score, player, stats } = req.body;
    const newMatch = new Match({
      opponent,
      result,
      score,
      player,
      stats,
    });
    const match = await newMatch.save();
    res.json(match);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
