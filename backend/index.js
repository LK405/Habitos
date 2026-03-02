const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// permisos para que el frontend pueda conectarse
app.use(cors());
app.use(express.json());

// conexion a mongodb atlas
mongoose.connect('mongodb+srv://habitoUser:asdf1234asdf@habitoscluster.dxcppgb.mongodb.net/HabitosDB')
.then(() => console.log('conectado a mongodb atlas'))
.catch(err => console.error('error de conexion:', err));

// esquema del habito (agregue el campo conteo para los 66 dias)
const habitoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  conteo: { type: Number, default: 1 }, // esto es para la barra de progreso
  fecha: { type: Date, default: Date.now }
});

const Habito = mongoose.model('Habito', habitoSchema);

// --- RUTAS ---

// 1. obtener todos los habitos (ESTA ES LA QUE NECESITA EL FRONTEND)
app.get('/habitos', async (req, res) => {
  try {
    const lista = await Habito.find();
    res.json(lista);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 2. crear un habito nuevo
app.post('/habitos', async (req, res) => {
  try {
    const nuevoHabito = new Habito(req.body);
    await nuevoHabito.save();
    res.status(201).send(nuevoHabito);
  } catch (err) {
    res.status(400).send(err);
  }
});

// 3. eliminar habito por id
app.delete('/habitos/:id', async (req, res) => {
  try {
    const habitoEliminado = await Habito.findByIdAndDelete(req.params.id);
    if (!habitoEliminado) return res.status(404).send({ mensaje: 'no encontrado' });
    res.send({ mensaje: 'habito eliminado', habitoEliminado });
  } catch (err) {
    res.status(400).send(err);
  }
});

// 4. actualizar habito (sirve para sumar dias al conteo)
app.put('/habitos/:id', async (req, res) => {
  try {
    const habitoActualizado = await Habito.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!habitoActualizado) return res.status(404).send({ mensaje: 'no encontrado' });
    res.send(habitoActualizado);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/', (req, res) => {
  res.send('servidor express funcionando');
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});