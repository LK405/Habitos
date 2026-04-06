const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const habitRoutes = require("./routes/habitRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ["http://localhost:3000", "https://habitos-frontend-zeta.vercel.app"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Hábitos funcionando ✅" });
});

// Conexion optimizada para serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("MongoDB conectado");
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/", habitRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`);
});

module.exports = app;