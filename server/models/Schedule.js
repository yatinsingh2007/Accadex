const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  opponent: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Friendly", "League", "Tournament"],
    default: "Friendly",
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
