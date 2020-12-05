const express = require('express');
const router = express.Router();

var fs = require('fs');
var busboy = require('connect-busboy');
var conexion = require('../modulos/conexion');
var lecturaArchivos = require('../modulos/lecturaArchivos');
var validaciones = require('../modulos/validaciones');

router.use(express.json({ limit: '1mb' }))

router.use(busboy());

const listaAsistenciaModel = require('../models/listaAsistencia');
const grupoModel = require('../models/grupo');
const cursoModel = require('../models/curso');
const { render } = require('ejs');

router.get('/', async (req, res) => {
    res.render('principal');
})

router.post('/asistencias', async (req, res, next) => {
    var grupo = req.body.grupo;
    var curso = req.body.curso;
    var archivosRecibidos = -1;

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        if (fieldname == 'curso') {
            curso = val;
        }
        if (fieldname == 'grupo') {
            grupo = val;
        }
        if (fieldname == 'archivosRecibidos') {
            archivosRecibidos = val;
        }
    });

    var up = 0;
    function ejecutar(direccion, filename) {
        lecturaArchivos.leerArchivo(direccion, async (listaObj) => {
            console.log("Curso: " + curso);
            console.log("Grupo: " + grupo);

            if (!validaciones.validarCadenaVacia(grupo)) {
                console.log("nada...");
                res.json({ res: "No hay un grupo seleccionado." });
            }
            else {
                grupo = await conexion.obtenerGrupo(grupo);

                listaObj.curso = curso;
                listaObj.grupo = grupo;

                //console.log(listaObj);
                conexion.registrarAsistencia(listaObj, async (err) => {
                    if (err != null) {
                        res.json({ res: "Ha ocurrido un error desconocido al subir los archivos." });
                    }
                    else {
                        console.log("Registrada.");

                        up++;
                        if (up == archivosRecibidos) { //si se terminaron de subir todos
                            res.json({ res: "Archivos subidos exitosamente." });
                        }
                    }
                });
            }
        });
    }

    //logica de subida
    var leidos = 0;
    var archivos = [];
    function intentarFinalizar() {
        if (leidos == archivosRecibidos) {
            for (let index = 0; index < archivos.length; index++) {
                const l = archivos[index];
                ejecutar(l.direccion, l.filename);
            }
        }
    }

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var direccion = 'tmp/' + filename;
        fstream = fs.createWriteStream(direccion);
        file.pipe(fstream);
        fstream.on('close', function () {
            //ejecutar(direccion, filename);
            archivos[leidos] = { "direccion": direccion, "filename": filename };
            leidos++;
            intentarFinalizar();
        });
    });

    req.busboy.on('finish', function () {
        intentarFinalizar();
    })
});

router.get('/asistencias/:modo/:filtro', async (req, res) => {
    var modo = req.params.modo;
    var filtro = req.params.filtro;

    if (!validaciones.validarCadenaVacia(modo)) { // Si el parámetro "modo" enviado es nulo o indefinido.
        console.log("modo nulo");
        res.json({});
    }
    if (modo == 'curso') { // Filtrar por curso.
        conexion.obtenerAsistenciasCallback((listaAsistencia) => {
            if (!validaciones.validarCadenaVacia(filtro)) { // Si el parámetro "filtro" enviado es nulo o indefinido.
                console.log("filtro nulo");
                res.json({});
            }
            else {
                console.log("generando");
                var lista = [];
                for (let index = 0; index < listaAsistencia.length; index++) {
                    const l = listaAsistencia[index];
                    if (l.grupo.curso.nombre == filtro) {
                        lista.push(l);
                    }
                }
                if (lista.length == 0) {
                    res.json({ res: "No se encontraron asistencias registradas." });//esto deberia mostrar una alerta pero no se
                    console.log(lista.length);
                } else {
                    res.json(lista);
                }
            }
        });
    }
});

router.get('/cursos', async (req, res) => {
    const cursos = await cursoModel.find();
    res.json(cursos);
});

router.post('/cursos', async (req, res, next) => {
    const curso = req.body.nombre;

    var err = validaciones.validarCurso(curso);
    if (err != null) { // No es válido.
        res.json({ res: err });
    } else {
        const existe = await conexion.obtenerCurso(curso);
        if (existe == null) {
            const cursos = await cursoModel.find();
            var repetido = false;
            for (let index = 0; index < cursos.length; index++) {
                const element = cursos[index];
                if (curso.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                    console.log("esta repetido");
                    res.json({ res: "Un curso con este nombre ya existe." });
                    repetido = true;
                    break;
                }
            }
            if (repetido == false) {
                console.log("no esta repetido se crea");
                conexion.crearCurso(curso);
                res.json({ res: "Curso agregado." });
            }
        }
        else {
            console.log("esta repetido");
            res.json({ res: "Un curso con este nombre ya existe." });
        }
    }
});

router.delete('/cursos', async (req, res, next) => {
    const curso = req.body.nombre;

    var err = validaciones.validarCurso(curso);
    if (err != null) { // No es válido.
        res.json({ res: err });
    }
    else {
        const existe = await conexion.obtenerCurso(curso);
        if (existe == null) {
            res.json({ res: "El curso que intenta borrar no existe." });
        }
        else {
            conexion.eliminarCurso(curso, err => {
                if (err != null) {
                    res.json({ res: "Ha ocurrido un error desconocido." });
                }
                else {
                    res.json({ res: "Curso eliminado." });
                }
            });
        }
    }
});

router.put('/cursos', async (req, res, next) => {
    const curso = req.body.nombre;
    const nuevoCurso = req.body.nuevoNombre;

    var err = validaciones.validarCurso(curso) || validaciones.validarCurso(nuevoCurso);
    if (err != null) { // No es válido.
        res.json({ res: err });
    } else {
        const existe = await conexion.obtenerCurso(curso);
        if (existe == null) {
            res.json({ res: "El curso que intenta modificar no existe." });
        } else {
            const cursos = await cursoModel.find();
            var repetido = false;
            for (let index = 0; index < cursos.length; index++) {
                const element = cursos[index];
                if (nuevoCurso.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                    console.log("esta repetido");
                    res.json({ res: "Un curso con este nombre ya existe." });
                    repetido = true;
                    break;
                }
            }
            if (repetido == false) {
                conexion.modificarCurso(curso, nuevoCurso, (err) => {
                    if (err != null) {
                        res.json({ res: "Ha ocurrido un error desconocido." });
                    }
                    else {
                        res.json({ res: "Curso modificado." });
                    }
                });
            }
        }
    }
});

router.get('/grupos', async (req, res) => {
    const grupos = await grupoModel.find();
    res.json(grupos);
});

router.get('/grupos/:curso', async (req, res) => {
    const curso = req.params.curso;

    const existe = await conexion.obtenerCurso(curso);
    if (existe == null) {
        res.json({});
    }
    else {
        var listaGrupos = [];

        const grupos = await grupoModel.find();
        for (let index = 0; index < grupos.length; index++) {
            const grupo = grupos[index];
            console.log(grupo.curso + " - " + existe._id);
            if (grupo.curso.equals(existe._id)) {
                listaGrupos.push(grupo);
            }
        }
        res.json(listaGrupos);
    }
});

router.post('/grupos', async (req, res, next) => {
    const grupo = req.body.nombre;
    const curso = req.body.curso;

    var err = validaciones.validarGrupo(grupo) || validaciones.validarCurso(curso);
    if (err != null) { // No es válido.
        res.json({ res: err });
    } else {
        const existe = await conexion.obtenerGrupo(grupo);
        if (existe == null) {
            const grupos = await grupoModel.find();
            var repetido = false;
            for (let index = 0; index < grupos.length; index++) {
                const element = grupos[index];
                if (grupo.toUpperCase() == element.nombre.toUpperCase()) { // Ya existe.
                    console.log("esta repetido");
                    res.json({ res: "Un grupo con este nombre ya existe." });
                    repetido = true;
                    break;
                }
            }
            if (repetido == false) {
                console.log("no esta repetido se crea");
                await conexion.crearGrupo(grupo, curso);
                res.json({ res: "Grupo agregado." });
            }
        }
        else {
            console.log("esta repetido");
            res.json({ res: "Un grupo con este nombre ya existe." });
        }
    }
});

router.get('/unidades', async (req, res) => {
    res.json([]);
});

module.exports = router;