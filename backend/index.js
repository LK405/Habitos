const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const habitRoutes = require("./routes/habitRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ["http://localhost:3000", "https://habitos-frontend.vercel.app"],
  credentials: true
}));
app.use(express.json());

app.use("/", habitRoutes);
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`);
});