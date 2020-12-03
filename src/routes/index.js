const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var conexion = require('../modulos/conexion');
var lecturaArchivos = require('../modulos/lecturaArchivos');

router.use(express.json({limit:'1mb'}))

router.use(busboy());

const listaAsistenciaModel = require('../models/listaAsistencia');
const grupoModel = require('../models/grupo');
const cursoModel = require('../models/curso');
const { render } = require('ejs');

/*
router.post('/asistencias', async (req, res, next) => {
    var grupo = await conexion.obtenerGrupo(grupo);
    var dirArchivo = req.body.dirArchivo;
    var curso = await conexion.obtenerCurso(curso);
    var archivosRecibidos = 0;

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        if (fieldname == 'curso') {
            curso = val;
        }
        if (fieldname == 'archivosRecibidos') {
            archivosRecibidos = val;
            console.log("Recibiendo: " + val);
        }
    });

    var archivoSubido = [];
    var listaGrupos = [];
    function mostrarSiguiente() {
        conexion.obtenerAsistenciasCallback((listaAsistencia) => {
            res.render('RegistrarAsistencias', { listaAsistencia, listaGrupos, archivoSubido });
        });
    }

    function ejecutar(direccion, filename) {
        lecturaArchivos.leerArchivo(direccion, async (listaObj) => {
            //const curso = listaObj.curso;
            const existe = await conexion.obtenerCurso(curso);
            if (existe[0] == null) {
                res.render('cursos', { res: 2, prellenado: curso });
            }
            else {
                if (typeof (grupo) == "undefined") {
                    console.log("grupo no definido todavia");

                    if (listaGrupos[0] == null) {
                        const grupos = await grupoModel.find();
                        for (let index = 0; index < grupos.length; index++) {
                            const grupo = grupos[index];
                            if (grupo.curso.equals(existe[0]._id)) {
                                listaGrupos.push(grupo);
                            }
                        }
                    }

                    if (listaGrupos[0] == null) {
                        const cursos = await cursoModel.find();
                        res.render('grupos', { res: 2, cursos });
                    }
                    else {
                        console.log("archivo push");
                        archivoSubido.push(filename);
                        //mostrarSiguiente();
                    }
                }
                else {
                    console.log("si hay grupo");
                    listaObj.grupo = grupo;
                    conexion.registrarAsistencia(listaObj, async (err) => {
                        console.log("Registrada.")
                    });
                }
            }
        });
    }

    var up = 0;
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            ejecutar(direccion, filename);
            up++;
            if (up == archivosRecibidos)
                mostrarSiguiente();
        });
    });

    if (typeof (dirArchivo) != "undefined") {
        var archivosArr = dirArchivo.split(",");

        for (let index = 0; index < archivosArr.length; index++) {
            const nom = archivosArr[index];
            const direccion = 'tmp/' + nom;
            ejecutar(direccion, nom);
        }

        //res.redirect('back');
    }
});
*/
router.post('/asistencias', async (req, res, next) => {
    var grupo = req.body.grupo;
    var curso = req.body.curso;
    var archivosRecibidos = 0;

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        if (fieldname == 'curso') {
            curso = val;
        }
        if (fieldname == 'grupo') {
            grupo = val;
            console.log("GURPO RECIBIOD.")
        }
        if (fieldname == 'archivosRecibidos') {
            archivosRecibidos = val;
            console.log("Recibiendo: " + val);
        }
    });

    var listaGrupos = [];
    function ejecutar(direccion, filename) {
        lecturaArchivos.leerArchivo(direccion, async (listaObj) => {
            console.log("Curso: " + curso);
            console.log("Grupo: " + grupo);

            grupo = (await conexion.obtenerGrupo(grupo))[0];

            listaObj.curso = curso;
            listaObj.grupo = grupo;

            //console.log(listaObj);
            conexion.registrarAsistencia(listaObj, async (err) => {
                console.log("Registrada.")
            });
        });
    }

    //logica de subida
    var up = 0;
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            ejecutar(direccion, filename);

            up++;
            if (up == archivosRecibidos) //si se terminaron de subir todos
                res.json({res: "Archivos subidos exitosamente."});
        });
    });
});
/*
router.get('/asistencias', async (req, res) => {
    //mostrar tabla
    const cursos = await cursoModel.find();
    conexion.obtenerAsistenciasCallback((listaAsistencia) => {
        //console.log(listaAsistencia);
        res.render('principal', { listaAsistencia, cursos, listaGrupos: [], archivoSubido: [] });
    });
});
*/
router.get('/asistencias/:modo&:filtro', async (req, res) => {
    var modo = req.params.modo;
    var filtro = req.params.filtro;

    if (modo == null || modo == "undefined") { // Si el parámetro "modo" enviado es nulo o indefinido.
        console.log("modo nulo");
        res.json({});
    }
    if (modo == 'curso') { // Filtrar por curso.
        conexion.obtenerAsistenciasCallback((listaAsistencia) => {
            if (filtro == null || filtro == "undefined") { // Si el parámetro "filtro" enviado es nulo o indefinido.
                console.log("filtro nulo");
                res.json({});
            }
            else {
                var lista = [];
                for (let index = 0; index < listaAsistencia.length; index++) {
                    const l = listaAsistencia[index];
                    if (l.grupo.curso.nombre == filtro) {
                        lista.push(l);
                    }
                }
                res.json(lista);
            }
        });
    }
});

/*
router.get('/cursos', async (req, res) => {
    res.render('cursos', { res: null, prellenado: null });
});
*/
router.get('/cursos', async (req, res) => {
    const cursos = await cursoModel.find();
    res.json(cursos);
});

router.post('/cursos', async (req, res, next) => {
    const curso = req.body.nombre;
    console.log(req.body);
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');
    if (typeof (curso) == "undefined" || curso.length > 60 || !regex.test(curso)) { // No es válido.
        res.json({res: "No es válido.", prellenado: null });
    } else {
        const existe = await conexion.obtenerCurso(curso);
        if (existe[0] == null) {
            console.log("no esta repetido se crea [0]");
            conexion.crearCurso(curso);
            res.json({res: "Curso agregado.", prellenado: null });
        }

        for (let index = 0; index < existe.length; index++) {
            const element = existe[index];
            if (curso.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                console.log("esta repetido")
                res.json({ res: "Un curso con este nombre ya existe.", prellenado: null });
                break;
            }
            if (index + 1 == existe.length) { // No existe.
                console.log("no esta repetido se crea")
                conexion.crearCurso(curso);
                res.json({ res: "Curso agregado.", prellenado: null });
            }
        }
    }
});

/*
router.post('/cursos', async (req, res, next) => {
    const curso = req.body.curso;
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');
    if (typeof (curso) == "undefined" || curso.length > 60 || !regex.test(curso)) { // No es válido.
        res.render('cursos', { res: null, prellenado: null });
    } else {
        const existe = await conexion.obtenerCurso(curso);
        if (existe[0] == null) {
            console.log("no esta repetido se crea [0]");
            conexion.crearCurso(curso);
            res.render('cursos', { res: 0, prellenado: null });
        }

        for (let index = 0; index < existe.length; index++) {
            const element = existe[index];
            if (curso.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                console.log("esta repetido")
                res.status(401).render('cursos', { res: 1, prellenado: null });
                break;
            }
            if (index + 1 == existe.length) { // No existe.
                console.log("no esta repetido se crea")
                conexion.crearCurso(curso);
                res.render('cursos', { res: 0, prellenado: null });
            }
        }
    }
});
*/
/*
router.get('/grupos', async (req, res) => {
    const cursos = await cursoModel.find();
    res.render('grupos', { res: null, cursos });
});
*/
router.get('/grupos', async (req, res) => {
    const grupos = await grupoModel.find();
    res.json(grupos);
});
router.get('/grupos/:curso', async(req, res) => {
    const curso = req.params.curso;

    const existe = await conexion.obtenerCurso(curso);
    if (existe[0] == null) {
        res.json({});
    }
    else {
        var listaGrupos = [];

        const grupos = await grupoModel.find();
        for (let index = 0; index < grupos.length; index++) {
            const grupo = grupos[index];
            if (grupo.curso.equals(existe[0]._id)) {
                listaGrupos.push(grupo);
            }
        }

        res.json(listaGrupos);
    }
})

router.post('/grupos', async (req, res, next) => {
    const grupo = req.body.nombre;
    const curso = req.body.curso;
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');

    if (typeof (grupo) == "undefined" || typeof (curso) == "undefined" || grupo.length > 50 || !regex.test(grupo)) { // No es válido.
        res.json({res: "No es válido."});
    } else {
        const existe = await conexion.obtenerGrupo(grupo);
        if (existe[0] == null) {
            console.log("no esta repetido se crea")
            await conexion.crearGrupo(grupo, curso);
            res.json({res: "Grupo agregado."});
        }

        for (let index = 0; index < existe.length; index++) {
            const element = existe[index];
            if (grupo.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                console.log("esta repetido")
                res.json({res: "Un grupo con este nombre ya existe." });
                break;
            }
            if (index + 1 == existe.length) { // No existe.
                console.log("no esta repetido se crea")
                await conexion.crearGrupo(grupo, curso);
                res.json({res: "Grupo agregado." });
            }
        }
    }
});

/*
router.post('/grupos', async (req, res, next) => {
    const cursos = await cursoModel.find();
    const grupo = req.body.grupo;
    const curso = req.body.curso;
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');

    if (typeof (grupo) == "undefined" || typeof (curso) == "undefined" || grupo.length > 50 || !regex.test(grupo)) { // No es válido.
        res.render('grupos', { cursos, res: null });
    } else {
        const existe = await conexion.obtenerGrupo(grupo);
        if (existe[0] == null) {
            console.log("no esta repetido se crea")
            await conexion.crearGrupo(grupo, curso);
            res.render('grupos', { cursos, res: 0 });
        }

        for (let index = 0; index < existe.length; index++) {
            const element = existe[index];
            if (grupo.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                console.log("esta repetido")
                res.status(401).render('grupos', { cursos, res: 1 });
                break;
            }
            if (index + 1 == existe.length) { // No existe.
                console.log("no esta repetido se crea")
                await conexion.crearGrupo(grupo, curso);
                res.render('grupos', { cursos, res: 0 });
            }
        }
    }
});
*/
router.get('/unidades', async (req, res) => {
    res.json([]);
});

module.exports = router;