const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var lecturaArchivos = require('../modulos/lecturaArchivos')

router.use(busboy());

const ListaAsistencia=require('../models/listaAsistencia');

router.post('/asistencias', (req,res,next)=>{
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            lecturaArchivos.leerArchivo(direccion);
            res.redirect('back');
        });
    });
});

router.get('/', async(req,res)=>{
    const listaAsistencia = await ListaAsistencia.find();
    res.render('main', {listaAsistencia});
});

module.exports = router;