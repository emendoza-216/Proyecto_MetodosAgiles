var mongoClient = require('mongodb').MongoClient;
var dbo;
var url = "mongodb://localhost:27017";

mongoClient.connect(url, (error, client) => {
    if (error) {
        console.log(error.code);
    } else {
        dbo = client.db("asistencias-mongo");
        console.log("Conectado a la BD");
    }
});

function crearCurso(nombre) {
    var doc = { "nombre": nombre };
    console.log(doc);
    dbo.collection("curso").insertOne(doc, (error) => {
        if (error) {
            console.log(">> Error: Query inválido.");
        } else {
            console.log(">> Curso insertado.");
        }
    });
}

function registrarAsistencia(listaAsistencia) {
    console.log(listaAsistencia);
    dbo.collection("listaAsistencia").insertOne(listaAsistencia, (error) => {
        if (error) {
            console.log(">> Error: Query inválido.");
        } else {
            console.log(">> Lista Asistencia insertada.");
        }
    });
}

module.exports.crearCurso = crearCurso;
module.exports.registrarAsistencia = registrarAsistencia;