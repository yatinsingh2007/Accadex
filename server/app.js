const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const connectDB = require("./lib/db");


app.get("/", (req, res) => {
  res.send("Accadex API is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/insights", require("./routes/insights"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/schedule", require("./routes/schedule"));


connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

module.exports = app;
