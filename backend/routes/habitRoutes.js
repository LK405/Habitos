const express = require("express");
const router = express.Router();
const Habit = require("../models/Habito");

router.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find({});
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving habits" });
  }
});

router.post("/habits", async (req, res) => {
  try {
    const { title, description } = req.body;

    const habit = new Habit({ title, description });
    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: "Error creating habit" });
  }
});

router.delete("/habits/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Habit not found" });
  }
});

router.patch("/habits/markasdone/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    habit.lastDone = new Date();

    if (timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24) {
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdate = new Date();
      await habit.save();

      res.status(200).json({ message: "Habit marked as done" });
    } else {
      habit.days = 0;
      habit.lastUpdate = new Date();
      habit.startedAt = new Date();
      await habit.save();

      res.status(200).json({ message: "Habit restarted" });
    }
  } catch (err) {
    res.status(500).json({ message: "Habit not found" });
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

module.exports = router;