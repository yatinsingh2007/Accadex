const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/accadex";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes Placeholders
app.get("/", (req, res) => {
  res.send("Accadex API is running");
});

// Import Routes
const authRoutes = require("./routes/auth");
const matchRoutes = require("./routes/matches");
const insightRoutes = require("./routes/insights");
const chatRoutes = require("./routes/chat");
const scheduleRoutes = require("./routes/schedule");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
