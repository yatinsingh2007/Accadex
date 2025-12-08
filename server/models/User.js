const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Will be hashed
    required: true,
  },
  academy: {
    type: String,
    default: "Default Academy",
  },
  role: {
    type: String,
    enum: ["player", "coach", "admin"],
    default: "player",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
