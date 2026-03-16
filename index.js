const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// mongo a atlas
mongoose.connect('mongodb+srv://habitoUser:asdf1234asdf@habitoscluster.dxcppgb.mongodb.net/HabitosDB')
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexion:', err));

// Middleware para leer JSON
app.use(express.json());

// Definir esquema de habito
const habitoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha: { type: Date, default: Date.now }
});

// Crear modelo de habito
const Habito = mongoose.model('Habito', habitoSchema);

// Endpoint POST para crear habito (alta)
app.post('/habitos', async (req, res) => {
  try {
    const nuevoHabito = new Habito(req.body);
    await nuevoHabito.save();
    res.status(201).send(nuevoHabito);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Endpoint DELETE para eliminar habito por id (baja)
app.delete('/habitos/:id', async (req, res) => {
  try {
    const habitoEliminado = await Habito.findByIdAndDelete(req.params.id);
    if (!habitoEliminado) return res.status(404).send({ mensaje: 'Habito no encontrado' });
    res.send({ mensaje: 'Habito eliminado', habitoEliminado });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Endpoint PUT para actualizar habito por id (cambio)
app.put('/habitos/:id', async (req, res) => {
  try {
    const habitoActualizado = await Habito.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!habitoActualizado) return res.status(404).send({ mensaje: 'Habito no encontrado' });
    res.send(habitoActualizado);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Ruta basica para probar servidor
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
