var mongoose = require("mongoose");

const grupoModel = require('../models/grupo');
const cursoModel = require('../models/curso');
const listaAsistenciaModel = require('../models/listaAsistencia');
const curso = require("../models/curso");

mongoose.connect("mongodb://localhost:27017/asistencias-mongo", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Conectado a la BD.");
});

function handleError(err){
    console.log(err);
}

function crearGrupo(nombreGrupo, nombreCurso) {
    cursoModel.findOne({"nombre": nombreCurso}, '_id', function (err, curso) {
        if (err) return handleError(err);

        var doc = new grupoModel({"nombre": nombreGrupo, curso: curso._id});

        doc.save(function (err, doc) {
            if (err) return console.error(err);
            console.log("Grupo insertado." + doc);
        });
    });
}

async function obtenerCurso(nombre) {
    const curso = await cursoModel.findOne({"nombre": nombre});
    
    return curso
}

function crearCurso(nombre) {
    var doc = new cursoModel({"nombre": nombre});

    doc.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Curso insertado.");
    });
}

function registrarAsistencia(listaAsistencia) {
    cursoModel.findOne({"nombre": listaAsistencia.curso}, '_id', function (err, curso) {
        grupoModel.findOne({"curso": curso._id }, '_id', function (err, grupo) {
            if (err) return handleError(err);

            listaAsistencia.grupo = grupo._id;

            var doc = new listaAsistenciaModel(listaAsistencia);

            doc.save(function (err, doc) {
                if (err) return console.error(err);
                console.log("Documento insertado.");
            });
        });
    })
}

module.exports.registrarAsistencia = registrarAsistencia;
module.exports.obtenerCurso = obtenerCurso;
module.exports.crearCurso = crearCurso;
module.exports.crearGrupo = crearGrupo;

