class optionHandler{
	constructor(sel, nombre) {
    var fetchData = this.obtenerOpciones(nombre);

    fetchData.then(res => {
      for(var i = 0; i < res.length; i++) {
          var opt = document.createElement('option');
          opt.innerHTML = res[i].nombre;
          opt.value = res[i].nombre;
          sel.appendChild(opt);
      }
    });
	}
	obtenerOpciones(nombre) {
    var source = null;
  
    if(nombre == 'Curso')
      source = "/cursos";
    if(nombre == 'Grupo')
      source = "/grupos";
    if(nombre == 'Unidad')
      source = "/unidades";
  
    if (source != null) {
      return fetch(source, {
        method: 'GET', 
      })
      .then(result => result.json())
      .then(function(result) {
        return result;
      }).catch(function(e) {
        console.log('Error', e);
      });
    }
    else {
      return [];
    }
  }
}