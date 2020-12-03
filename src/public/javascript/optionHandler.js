class optionHandler{
	constructor(document, nombre) {
    var sel = document.getElementById("select" + nombre);
    var txtField = document.getElementById("txtField" + nombre);
    var btnAgregar = document.getElementById("btnAgregar" + nombre);
    var btnModificar = document.getElementById("btnModificar" + nombre);
    var btnBorrar = document.getElementById("btnBorrar" + nombre);
    var selCursos = document.getElementById("selectCursos" + nombre);

    if(nombre == "Grupo"){
      selCursos.removeAttribute("hidden");
      this.selCursos = selCursos;
      this.refrescarOpciones("Curso", selCursos);
    }

    this.sel = sel;
    this.refrescarOpciones(nombre);

    btnAgregar.onclick = () => this.agregar(nombre, txtField.value);
    btnModificar.onclick = () => this.modificar(nombre, sel.value, txtField.value);
    btnBorrar.onclick = () => this.eliminar(nombre, sel.value);
  }
  agregar(opcion, nombre){
    console.log("agregando " + nombre);
    var source = this.obtenerRuta(opcion);
    console.log(source);
    
    var obj = this;
    var refrescar = function(){
      obj.refrescarOpciones(opcion);
      obj.refrescarOpciones("Curso", document.getElementById("selectCursosGrupo"));
    }

    var data = {
      "nombre": nombre,
    };
    if (opcion == "Grupo"){
      data.curso = this.selCursos.value;
    }

    fetch(source, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(result => result.json())
    .then(function(respuesta) {
      console.log(respuesta);
      if(respuesta.res != null)
        alert(respuesta.res);

      refrescar();
    }).catch(function(e) {
      console.log('Error', e);
      alert("Error: " + e);
    });
  }
  modificar(opcion, nombre, nuevoNombre){
    console.log("modificando " + nombre);
  }
  eliminar(opcion, nombre){
    console.log("eliminando " + nombre);
  }
  obtenerRuta(nombre){
    var source = null;
  
    if(nombre == 'Curso')
      source = "/cursos";
    if(nombre == 'Grupo')
      source = "/grupos";
    if(nombre == 'Unidad')
      source = "/unidades";
  
    return source;
  }
	refrescarOpciones(nombre, sel2) {
    var source = this.obtenerRuta(nombre);
    var sel = this.sel;
    if(sel2 != null)
      sel = sel2;

    fetch(source, {
        method: 'GET', 
      })
      .then(res => res.json())
      .then(function(res) {
        sel.innerHTML = "";
        for(var i = 0; i < res.length; i++) {
          var opt = document.createElement('option');
          opt.innerHTML = res[i].nombre;
          opt.value = res[i].nombre;
          sel.appendChild(opt);
        }
      })
      .catch(function(e) {
        console.log('Error', e);
      });
  }
}