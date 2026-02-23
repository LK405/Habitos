const mongoose = require('mongoose');

// Definir el esquema
const habitoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha: { type: Date, default: Date.now }
});

// Crear el modelo
const Habito = mongoose.model('Habito', habitoSchema);

module.exports = Habito;
