const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Performance", "Health", "Strategy"],
    default: "Performance",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  relatedPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Insight", InsightSchema);
