const mongoose = require('mongoose');

const grupo = new mongoose.Schema({
    nombre: String,
    alumnos: [{
        type: String
    }],
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'curso',
    }
});

module.exports = mongoose.model('grupo', grupo);