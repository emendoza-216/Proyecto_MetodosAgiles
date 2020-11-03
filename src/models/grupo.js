const mongoose = require('mongoose');

const grupoEsquema = new mongoose.Schema({
    nombre: Number
});

module.exports = mongoose.model('grupos', esquema);