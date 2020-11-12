const mongoose = require('mongoose');

const curso = new mongoose.Schema({
    nombre: String,
});

module.exports = mongoose.model('curso', curso);