const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// Get schedules for a user
router.get("/:userId", async (req, res) => {
  try {
    const schedules = await Schedule.find({ player: req.params.userId }).sort({
      date: 1,
    });
    res.json(schedules);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a new schedule
router.post("/", async (req, res) => {
  try {
    const { player, date, opponent, type } = req.body;
    const newSchedule = new Schedule({
      player,
      date,
      opponent,
      type,
    });
    const schedule = await newSchedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete a schedule
router.delete("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ msg: "Schedule removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
