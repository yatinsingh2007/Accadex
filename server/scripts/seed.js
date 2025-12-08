const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Match = require("../models/Match");
const Insight = require("../models/Insight");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Match.deleteMany({});
    await Insight.deleteMany({});
    console.log("Cleared existing data");

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    const demoUser = new User({
      name: "Demo Player",
      email: "demo@accadex.com",
      password: hashedPassword,
      academy: "Elite Sports Academy",
      role: "player",
    });

    await demoUser.save();
    console.log("Demo User Created");

    // Create Match Data (Rich History for Pitch)
    const matches = [
      {
        opponent: "City Rivals FC",
        result: "Win",
        score: "3-1",
        player: demoUser._id,
        stats: { points: 15, assists: 5, minutesPlayed: 90 },
        date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        opponent: "North Side Academy",
        result: "Draw",
        score: "2-2",
        player: demoUser._id,
        stats: { points: 10, assists: 2, minutesPlayed: 85 },
        date: new Date(Date.now() - 86400000 * 5),
      },
      {
        opponent: "West End Warriors",
        result: "Loss",
        score: "0-1",
        player: demoUser._id,
        stats: { points: 5, assists: 1, minutesPlayed: 90 },
        date: new Date(Date.now() - 86400000 * 10),
      },
      {
        opponent: "Elite Strikers",
        result: "Win",
        score: "4-2",
        player: demoUser._id,
        stats: { points: 20, assists: 3, minutesPlayed: 88 },
        date: new Date(Date.now() - 86400000 * 14),
      },
      {
        opponent: "National Youth Club",
        result: "Win",
        score: "2-0",
        player: demoUser._id,
        stats: { points: 12, assists: 4, minutesPlayed: 90 },
        date: new Date(Date.now() - 86400000 * 20),
      },
      {
        opponent: "Valley High",
        result: "Loss",
        score: "1-3",
        player: demoUser._id,
        stats: { points: 8, assists: 1, minutesPlayed: 75 },
        date: new Date(Date.now() - 86400000 * 25),
      },
    ];
    await Match.insertMany(matches);
    console.log("Demo Matches Created (Rich Data)");

    const insights = [
      {
        title: "Improving Serve Consistency",
        description:
          "Your first serve percentage has dropped by 10% in the last 2 matches. Focus on toss height.",
        type: "Performance",
        relatedPlayer: demoUser._id,
        date: new Date(),
      },
      {
        title: "Recovery Needed",
        description:
          "High intensity workload detected. Recommend light stretching and hydration.",
        type: "Health",
        relatedPlayer: demoUser._id,
        date: new Date(),
      },
      {
        title: "Opponent Analysis: City Rivals",
        description:
          "They tend to attack the left flank. Strengthen defensive positioning on that side.",
        type: "Strategy",
        relatedPlayer: demoUser._id,
        date: new Date(Date.now() - 86400000 * 1),
      },
      {
        title: "Stamina Alert",
        description:
          "Your sprint speed dropped significantly after the 70th minute in the last game.",
        type: "Performance",
        relatedPlayer: demoUser._id,
        date: new Date(Date.now() - 86400000 * 3),
      },
    ];
    await Insight.insertMany(insights);
    console.log("Demo Insights Created (Rich Data)");

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
