const fs = require('fs');

function interpretarCsv(contenido) {
    var curso;
    var fecha;
    var asistencias = [];

    var regEncabezado = new RegExp('Attendance for: (.+) on (\\d{4}-\\d{2}-\\d{2})', 'g');
    var arrayEncabezado = regEncabezado.exec(contenido);
    if(arrayEncabezado != null) {
        curso = arrayEncabezado[1];
        fecha = arrayEncabezado[2];
    }

    var regAlumnos = new RegExp('\n(.+)[\?|✔].+', 'g');
    var array; 
    while(array = regAlumnos.exec(contenido)){
        var nombreAlumno = array[1].trim();
        asistencias.push(nombreAlumno);
    }

    var listaObj = {
        "curso" : curso.trim(), 
        "grupo" : null,
        "unidad" : 1,
        "fecha" : fecha.trim(),
        "asistencias" : asistencias
    };

    return listaObj;
}

function leerArchivo(dir, callback) {
    fs.readFile(dir, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        /*
        console.log(data)
        console.log("- DATOS -")
        */
        var listaObj = interpretarCsv(data);
        /*
        console.log("Curso: " + listaObj.curso);
        console.log("Fecha: " + listaObj.fecha);
        console.log("Asistencias: ");
        listaObj.asistencias.forEach(element => {
            console.log(element);
        });
        */
        callback(listaObj);
    })
}

function prueba() {
    leerArchivo('../ejemplosInput/Ágiles (2020-08-25).csv');
}

module.exports.leerArchivo = leerArchivo;
module.exports.prueba = prueba;