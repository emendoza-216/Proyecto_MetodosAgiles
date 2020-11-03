const mongoose = require('mongoose');

const unidadEsquema = new mongoose.Schema({
    id: String
});

module.exports = mongoose.model('unidades', esquema);