var mongoose = require("mongoose");

const grupoModel = require('../models/grupo');
const listaAsistenciaModel = require('../models/listaAsistencia');

mongoose.connect("mongodb://localhost:27017/asistencias-mongo", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Conectado a la BD.");
});

function crearCurso(nombre) {
    var doc = new grupoModel({"curso": nombre, "nombre": "Grupo 1"});
   
    doc.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Documento insertado.");
    });
}

function registrarAsistencia(listaAsistencia) {
    grupoModel.findOne({"curso": listaAsistencia.curso}, '_id', function(err, grupo) {
        if (err) return handleError(err);

        listaAsistencia.grupo = grupo._id;

        var doc = new listaAsistenciaModel(listaAsistencia);

        doc.save(function(err, doc) {
            if (err) return console.error(err);
            console.log("Documento insertado.");
        });
    });
}

module.exports.crearCurso = crearCurso;
module.exports.registrarAsistencia = registrarAsistencia;