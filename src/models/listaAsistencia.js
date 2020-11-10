const mongoose = require('mongoose');

const listaAsistencia = new mongoose.Schema({
    grupo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grupo',
    },
    unidad: Number,
    fecha: String,
    asistencias: [{
        type: String
    }]
});

module.exports = mongoose.model('listaAsistencia', listaAsistencia);