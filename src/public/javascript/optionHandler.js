class optionHandler {
  constructor(document, nombre) {
    var sel = document.getElementById("select" + nombre);
    var txtField = document.getElementById("txtField" + nombre);
    var btnAgregar = document.getElementById("btnAgregar" + nombre);
    var btnModificar = document.getElementById("btnModificar" + nombre);
    var btnBorrar = document.getElementById("btnBorrar" + nombre);

    var selCursos = document.getElementById("selectCursos" + nombre);

    var selModo = document.getElementById("modo");
    var selFiltro = document.getElementById("filtro");
    var btnBuscar = document.getElementById("buscar");

    if (selCursos != null) {
      if (nombre == "Grupo") {
        selCursos.removeAttribute("hidden");
        this.selCursos = selCursos;
        this.refrescarOpciones("Curso", selCursos);
      }
    }

    if (sel != null) {
      this.sel = sel;
      this.refrescarOpciones(nombre);
    }

    if (btnAgregar != null)
      btnAgregar.onclick = () => this.agregar(nombre, txtField.value);

    if (btnModificar != null)
      btnModificar.onclick = () => this.modificar(nombre, sel.value, txtField.value);

    if (btnBorrar != null)
      btnBorrar.onclick = () => this.eliminar(nombre, sel.value);

    if (selModo != null && selFiltro != null && btnBuscar != null) {
      btnBuscar.onclick = () => this.buscar(selModo.value, selFiltro.value);
      selModo.onchange = () => this.refrescarOpciones(selModo.options[selModo.selectedIndex].innerHTML, selFiltro);
      this.refrescarOpciones(selModo.options[selModo.selectedIndex].innerHTML, selFiltro);
    }
  }
  
  buscar(modo, filtro) {
    console.log(modo, filtro);

    fetch("/asistencias/" + modo + "/" + filtro, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(function (res) {
        if (res.res) {
          alert(res.res);
        }
        else {
          var tbody = document.getElementById("tablaAsistenciasBody");
          console.log(res);
          var html = ''; //curso, grupo, fecha, unidad, asistencias
          for (var key = 0, size = res.length; key < size; key++) {
            html += '<tr><td>'
              + res[key].grupo.curso.nombre
              + '</td><td>'
              + res[key].grupo.nombre
              + '</td><td>'
              + res[key].fecha
              + '</td><td>'
              + res[key].unidad
              + '</td><td>'
              + res[key].asistencias
              + '</td></tr>';
          }

          tbody.innerHTML = html;
        }
      })
      .catch(function (e) {
        console.log('Error', e);
      });
  }

  agregar(opcion, nombre) {
    console.log("agregando " + nombre);

    var obj = this;
    this.actualizarTodo(opcion);

    var data = {
      "nombre": nombre,
    };
    if (opcion == "Grupo") {
      data.curso = this.selCursos.value;
    }

    fetch(this.obtenerRuta(opcion), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(result => result.json())
      .then(function (respuesta) {
        console.log(respuesta);
        if (respuesta.res != null)
          alert(respuesta.res);

        obj.actualizarTodo(opcion);
      }).catch(function (e) {
        console.log('Error', e);
        alert("Error: " + e);
      });
  }

  modificar(opcion, nombre, nuevoNombre) {
    console.log("modificando " + nombre);

    var obj = this;
    this.actualizarTodo(opcion);

    var data = {
      "nombre": nombre,
      "nuevoNombre": nuevoNombre,
    };

    fetch(this.obtenerRuta(opcion), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(result => result.json())
      .then(function (respuesta) {
        console.log(respuesta);
        if (respuesta.res != null)
          alert(respuesta.res);

        obj.actualizarTodo(opcion);
      }).catch(function (e) {
        console.log('Error', e);
        alert("Error: " + e);
      });
  }
  eliminar(opcion, nombre) {
    console.log("eliminando " + nombre);

    var obj = this;
    this.actualizarTodo(opcion);

    var data = {
      "nombre": nombre,
    };

    fetch(this.obtenerRuta(opcion), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(result => result.json())
      .then(function (respuesta) {
        console.log(respuesta);
        if (respuesta.res != null)
          alert(respuesta.res);

        obj.actualizarTodo(opcion);
      }).catch(function (e) {
        console.log('Error', e);
        alert("Error: " + e);
      });
  }
  obtenerRuta(nombre) {
    var source = null;

    if (nombre == 'Curso')
      source = "/cursos";
    if (nombre == 'Grupo')
      source = "/grupos";
    if (nombre == 'Unidad')
      source = "/unidades";

    return source;
  }
  refrescarOpciones(nombre, sel2) {
    var source = this.obtenerRuta(nombre);
    var sel = this.sel;
    if (sel2 != null)
      sel = sel2;

    fetch(source, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(function (res) {
        sel.innerHTML = "";
        for (var i = 0; i < res.length; i++) {
          var opt = document.createElement('option');
          opt.innerHTML = res[i].nombre;
          opt.value = res[i].nombre;
          sel.appendChild(opt);
        }
      })
      .catch(function (e) {
        console.log('Error', e);
      });
  }
  actualizarTodo(opcion) {
    var obj = this;
    //var refrescar = function(){
    obj.refrescarOpciones(opcion);
    obj.refrescarOpciones("Curso", document.getElementById("selectCursosGrupo"));
    var selModo = document.getElementById("modo");
    obj.refrescarOpciones(selModo.options[selModo.selectedIndex].innerHTML, document.getElementById("filtro"));
    //}
    //refrescar();
  }
}