const mongoose = require('mongoose');

const grupo = new mongoose.Schema({
    nombre: String,
    curso: String,
    alumnos: [{
        type: String
    }]
});

module.exports = mongoose.model('grupo', grupo);