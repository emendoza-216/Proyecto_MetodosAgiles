const mongoose = require('mongoose');

const cursoEsquema = new mongoose.Schema({
    nombre: String
});

                                //Nombre de colección
                                //En bd
module.exports = mongoose.model('cursos', cursoEsquema);