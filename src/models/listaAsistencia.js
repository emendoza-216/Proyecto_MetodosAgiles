const mongoose = require('mongoose');

const esquema = new mongoose.Schema({
    curso: String,
    fecha: String,
    asistencias: [{
        type: String
    }]
});

module.exports = mongoose.model('listaAsistencia', esquema);