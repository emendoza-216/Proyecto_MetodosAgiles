const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var conexion = require('../modulos/conexion');
var lecturaArchivos = require('../modulos/lecturaArchivos');

router.use(busboy());

const listaAsistenciaModel = require('../models/listaAsistencia');
const grupoModel = require('../models/grupo');
const { render } = require('ejs');

router.post('/asistencias', (req, res, next) => {
    console.log("llega un post");
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            lecturaArchivos.leerArchivo(direccion, (listaObj) => { conexion.registrarAsistencia(listaObj) });
            res.redirect('back');
        });
    });
});

router.get('/asistencias', async (req, res) => {
    const listaAsistencia = await listaAsistenciaModel.find().populate('grupo').exec();
    console.log(listaAsistencia);
    res.render('main', { listaAsistencia });
});

router.get('/cursos', async (req, res) => {
    res.render('cursos');
});

router.post('/cursos', (req, res, next) => {
    const curso = req.body.curso;
    const regex = new RegExp('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$', 'i');
    if (typeof (curso) == "undefined" || !regex.test(curso)) { // No es válido.
        res.render('cursos');
    } else {
        conexion.crearCurso(curso);
        res.render('cursos')
    }
});

module.exports = router;