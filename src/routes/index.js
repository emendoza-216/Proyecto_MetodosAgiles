const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var conexion = require('../modulos/conexion');
var lecturaArchivos = require('../modulos/lecturaArchivos');

router.use(busboy());

const listaAsistenciaModel = require('../models/listaAsistencia');
const grupoModel = require('../models/grupo');
const cursoModel = require('../models/curso');
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
    const listaAsistencia = [];

    await listaAsistenciaModel.find().populate('grupo').exec(async(err, lista) => {
        for(var i=0; i<lista.length; i++) {
            const curso = await cursoModel.findOne({"_id":lista[i].grupo.curso}).exec();
            lista[i].grupo.curso = curso;
            listaAsistencia.push(lista[i]);
        };

        console.log("Final " + listaAsistencia);
        res.render('RegistrarAsistencias', { listaAsistencia });
    });
});

router.get('/cursos', async (req, res) => {
    res.render('cursos', {res: null});
});

router.post('/cursos', async(req, res, next) => {
    const curso = req.body.curso;
    const regex = new RegExp('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$', 'i');
    if (typeof(curso) == "undefined" || curso.length > 50 || !regex.test(curso)) { // No es válido.
        res.render('cursos', {res: null});
    } else {
        const existe = await conexion.obtenerCurso(curso);

        for (let index = 0; index < existe.length; index++) {
            const element = existe[index];
            if(curso.toUpperCase() == element.nombre.toUpperCase()){//ya existe
                console.log("esta repetido")
                res.status(401).render('cursos', {res: 1});
                break
            }
            if(index+1 == existe.length){//no existe
                console.log("no esta repetido se crea")
                conexion.crearCurso(curso);
                res.render('cursos', {res: 0});
            }
        }
    }
});

router.get('/grupos', async (req, res) => {
    const cursos = await cursoModel.find();
    console.log(cursos);
    res.render('grupos', {cursos});
});

router.post('/grupos', async (req, res, next) => {
    const grupo = req.body.grupo;
    const curso = req.body.curso;

    const regex = new RegExp('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$', 'i');
    if (typeof(grupo) == "undefined" || typeof(curso) == "undefined" || grupo.length > 50 || !regex.test(grupo) ) { // No es válido.
        res.render('grupos');
    } else {
        await conexion.crearGrupo(grupo, curso);
        res.redirect('back');
    }
});

module.exports = router;