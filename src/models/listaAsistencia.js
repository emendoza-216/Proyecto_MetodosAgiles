const mongoose = require('mongoose');

const asistencias = new mongoose.Schema({
    grupoID : String,
    unidad: Number,
    fecha: String,
    asistencias: [{
        type: String
    }]
});

module.exports = mongoose.model('listaAsistencia', asistencias);