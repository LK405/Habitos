const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
const PORT = 3001;
const habitRoutes = require("./routes/habitRoutes");
app.use(express.json());
app.use(cors());
app.use("/api", habitRoutes);
app.use("/api", userRoutes);

mongoose.connect("mongodb://localhost:27017/habitos")
.then(() => console.log("mongodb conectado"))
.catch(err => console.log(err));




app.get("/api/test", (req, res) => {
  res.json({ mensaje: "backend funcionando" });
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`);
});