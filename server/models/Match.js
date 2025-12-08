const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  opponent: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    enum: ["Win", "Loss", "Draw"],
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stats: {
    points: Number,
    assists: Number,
    minutesPlayed: Number,
  },
});

module.exports = mongoose.model("Match", MatchSchema);
