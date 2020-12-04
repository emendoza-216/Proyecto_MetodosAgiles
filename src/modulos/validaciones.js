function validarCurso(curso){
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');

    var err = null;
    if(typeof (curso) == "undefined")
        err = "Curso no definido.";
    if(curso.length > 60)
        err = "El curso debe ser igual o menor a 60 caracteres.";
    if(!regex.test(curso))
        err = "Para el curso introduzca solo letras (A-Z) o (a-z). Máximo 60 caracteres. Evite espacios al inicio o final del nombre.";

    return err;
}

function validarGrupo(grupo) {
    const regex = new RegExp('^[a-zA-ZÀ-ÿ _\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ _\u00f1\u00d1]*)+$', 'i');
    
    var err = null;
    if(typeof (grupo) == "undefined")
        err = "Grupo no definido.";
    if(grupo.length > 50)
        err = "El grupo debe ser igual o menor a 50 caracteres.";
    if(!regex.test(grupo))
        err = "Para el grupo introduzca solo letras (A-Z) o (a-z). Máximo 50 caracteres. Evite espacios al inicio o final del nombre.";

    return err;
}

function validarCadenaVacia(str) {
    return !(str == null || typeof(str) == "undefined" || str.length == 0);
}

module.exports.validarCurso = validarCurso;
module.exports.validarGrupo = validarGrupo;
module.exports.validarCadenaVacia = validarCadenaVacia;