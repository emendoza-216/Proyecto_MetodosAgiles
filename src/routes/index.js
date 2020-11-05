const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var conexion = require('../modulos/conexion');
var lecturaArchivos = require('../modulos/lecturaArchivos');

router.use(busboy());

//const ListaAsistencia = require('../models/listaAsistencia');

router.post('/asistencias', (req,res,next)=>{
    console.log("llega un post");
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            lecturaArchivos.leerArchivo(direccion, (listaObj)=>{conexion.registrarAsistencia(listaObj)});
            res.redirect('back');
        });
    });
});

router.get('/asistencias', async (req, res) => {
    //const listaAsistencia = await ListaAsistencia.find();
    res.render('main');
});

router.get('/cursos', async (req, res) => {
    res.render('cursos');
});

router.post('/cursos', (req, res, next) => {
    conexion.crearCurso(req.body.nombre);
    res.render('cursos');
});

module.exports = router;