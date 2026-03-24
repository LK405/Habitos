const express = require("express");
const router = express.Router();
const Habit = require("../models/Habito");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

// Middleware JWT — igual al ejemplo del profesor
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }
  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

router.get("/habits", authenticateToken, async (req, res) => {
  try {
    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) return res.status(500).json({ message: "Error retrieving habits" });
    const habits = await Habit.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving habits" });
  }
});

router.post("/habits", authenticateToken, async (req, res) => {
  try {
    let { title, description } = req.body;
    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) return res.status(500).json({ message: "Error creating habit" });
    userId = new mongoose.Types.ObjectId(userId);
    const habit = new Habit({ title, description, userId });
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: "Error creating habit" });
  }
});

router.delete("/habits/:id", authenticateToken, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Habit not found" });
  }
});

router.patch("/habits/markasdone/:id", authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

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
  return Math.abs(date1 - date2) / (1000 * 60 * 60);
};
const timeDifferenceInDays = (date1, date2) => {
  return Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
};

module.exports = router;