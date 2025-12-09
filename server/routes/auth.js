const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, academy, sport } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      academy,
      sport: sport || "Football",
    });

    await user.save();

    // Auto-generate Welcome Matches for Pitch
    const Match = require("../models/Match");
    const Insight = require("../models/Insight");

    const welcomeMatches = [
      {
        opponent: "Placement Match AI",
        result: "Win",
        score: "185/4 - 150/9",
        player: user.id,
        stats: { points: 65, assists: 0, minutesPlayed: 20 }, // Converted to Runs
        date: new Date(),
      },
      {
        opponent: "Training Squad",
        result: "Draw",
        score: "220/8 - 220/10",
        player: user.id,
        stats: { points: 45, assists: 2, minutesPlayed: 20 }, // Runs, Wickets
        date: new Date(Date.now() - 86400000 * 3),
      },
      {
        opponent: "Academy Reserves",
        result: "Loss",
        score: "135/10 - 138/2",
        player: user.id,
        stats: { points: 12, assists: 1, minutesPlayed: 15 },
        date: new Date(Date.now() - 86400000 * 7),
      },
    ];
    await Match.insertMany(welcomeMatches);

    // Auto-generate Welcome Insights
    const welcomeInsights = [
      {
        title: "Welcome to Accadex",
        description:
          "This is your AI-powered performance feed. Upload match clips to get personalized coaching.",
        type: "Strategy",
        relatedPlayer: user.id,
        date: new Date(),
      },
      {
        title: "Initial Assessment",
        description:
          "Based on your initial nets session, we recommend focusing on your front-foot defense.",
        type: "Performance",
        relatedPlayer: user.id,
        date: new Date(),
      },
    ];
    await Insight.insertMany(welcomeInsights);

    const payload = { user: { id: user._id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user._id, name: user.name, role: user.role },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const payload = { user: { id: user._id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user._id, name: user.name, role: user.role },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
