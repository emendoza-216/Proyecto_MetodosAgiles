var mongoose = require("mongoose");

const grupoModel = require('../models/grupo');
const cursoModel = require('../models/curso');
const listaAsistenciaModel = require('../models/listaAsistencia');
const curso = require("../models/curso");
const grupo = require("../models/grupo");

mongoose.connect("mongodb://localhost:27017/asistencias-mongo", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Conectado a la BD.");
});

function handleError(err) {
    console.log(err);
}

function crearGrupo(nombreGrupo, nombreCurso) {
    cursoModel.findOne({ "nombre": nombreCurso }, '_id', function (err, curso) {
        if (err) return handleError(err);

        var doc = new grupoModel({ "nombre": nombreGrupo, curso: curso._id });

        doc.save(function (err, doc) {
            if (err) return console.error(err);
            console.log("Grupo insertado." + doc);
        });
    });
}

async function obtenerGrupo(nombre) {
    const grupos = await grupoModel.find();
    for (let index = 0; index < grupos.length; index++) {
        const grupo = grupos[index];
        if (grupo.nombre == nombre) {
            return grupo;
        }
    }

    return null;
}

async function obtenerCurso(nombre) {
    const cursos = await cursoModel.find();
    for (let index = 0; index < cursos.length; index++) {
        const curso = cursos[index];
        if (curso.nombre == nombre) {
            return curso;
        }
    }

    return null;
}

function crearCurso(nombre, callback) {
    var doc = new cursoModel({ "nombre": nombre });
    if(callback == null){
        callback = function(){}
    }

    doc.save(function (err, doc) {
        if (err) {
            callback(err);
            return console.error(err); 
        };
        console.log("Curso insertado.");
        callback();
    });
}

function modificarCurso(nombre, nuevoNombre, callback) {
    var doc = new cursoModel({ "nombre": nombre });
    if(callback == null){
        callback = function(){}
    }

    cursoModel.findOneAndUpdate({"nombre":nombre}, {"nombre":nuevoNombre}, null, function (err, doc) {
        if (err) {
            callback(err);
            return console.error(err); 
        };
        console.log("Curso actualizado.");
        callback();
    });
}

function eliminarCurso(nombre, callback) {
    if(callback == null){
        callback = function(){}
    }
    
    cursoModel.deleteOne({"nombre": nombre}, function (err, doc) {
        if (err) {
            callback(err);
            return console.error(err); 
        };
        console.log("Curso eliminado.");
        callback();
    });
}

async function obtenerAsistenciasCallback(callback) {
    listaAsistenciaModel.find().populate('grupo').exec(async(err, lista) => {
        const listaAsistencia = [];
        
        for (var i = 0; i < lista.length; i++) {
            const curso = await cursoModel.findOne({ "_id": lista[i].grupo.curso }).exec();
            lista[i].grupo.curso = curso;
            listaAsistencia.push(lista[i]);
        };

        callback(listaAsistencia);
        //console.log("Final " + listaAsistencia);
    });
}

function registrarAsistencia(listaAsistencia, resCallback) {
    cursoModel.findOne({ "nombre": listaAsistencia.curso }, '_id', function (err, curso) {
        grupoModel.find({"curso": listaAsistencia.grupo.curso._id }, null, function (err, grupos) {
            var encontrado = false;
            console.log(grupos);
            for (let index = 0; index < grupos.length; index++) {
                var grupo = grupos[index];
                console.log(grupo.nombre + " , " + listaAsistencia.grupo.nombre);
                if (grupo.nombre == listaAsistencia.grupo.nombre) { 
                    if (err) return handleError(err);

                    listaAsistencia.grupo = grupo._id;

                    var doc = new listaAsistenciaModel(listaAsistencia);

                    doc.save(function (err, doc) {
                        if (err) return console.error(err);
                        console.log("Documento insertado.");
                    });
                    
                    encontrado = true;
                    resCallback(); //se encontro
                    break;
                }
            }

            if(!encontrado)
                resCallback(1); //no se encontro ningun grupo
        });
    })
}

module.exports.obtenerAsistenciasCallback = obtenerAsistenciasCallback;
module.exports.registrarAsistencia = registrarAsistencia;
module.exports.obtenerCurso = obtenerCurso;
module.exports.modificarCurso = modificarCurso;
module.exports.eliminarCurso = eliminarCurso;
module.exports.obtenerGrupo = obtenerGrupo;
module.exports.crearCurso = crearCurso;
module.exports.crearGrupo = crearGrupo;

