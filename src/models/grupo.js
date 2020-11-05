const mongoose = require('mongoose');

const grupo = new mongoose.Schema({
    grupoID: String,
    nombre: String,
    curso: String,
    alumnos: [{
        type: String
    }]
});

module.exports = mongoose.model('grupos', grupo);