const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ error: "Error en registro" });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "secret123",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login exitoso", token });

  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

module.exports = router;