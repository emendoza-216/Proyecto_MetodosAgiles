function Modelo(props) {
  const txtField = "txtField" + props.name;
  const txtPlaceholder = "(Nombre de " + props.name + ")";
  const btnAgregar = "btnAgregar" + props.name;
  const btnModificar = "btnModificar" + props.name;
  const btnBorrar = "btnBorrar" + props.name;

  const formId = "forma" + props.name;
  const selectId = "select" + props.name;
  const error = "error" + props.name;

  const selectCursos = "selectCursos" + props.name;

  return (
    <div className="modelo">
      <b>{props.name}</b>
      <form id={formId}>
        <select id={selectId}></select>
        <button id={btnBorrar} type="button">Eliminar</button>
        <br/>
        <select id={selectCursos} hidden></select>
        <input type="text" id={txtField} name={txtField} placeholder={txtPlaceholder}/>
        <button id={btnAgregar} type="button">Agregar</button>
        <button id={btnModificar} type="button">Modificar</button>
      </form>
      <label id={error} className="Error"></label>
    </div>
  );
}

function Dropbox() {
  return (
    <div>
      <section id="dropbox">
        <label>ARRASTRA AQUÍ LAS LISTAS DE ASISTENCIA</label>
        <br/>
      </section>
      <button id="uploadButton" disabled>Subir Archivos</button>
      <form>
        <select id="cursoDeseado" hidden></select>
        <select id="grupoDeseado" hidden></select>
      </form>
    </div>
  );
}

function TablaAsistencias() {
  return (
    <div>
      <h3>Lista de asistencias:</h3>
      <div>
        <b>Modo:</b>
        <select id="modo">
          <option value="curso">Curso</option>
          <option value="grupo">Grupo</option>
          <option value="unidad">Unidad</option>
        </select>
        <b> Filtro:</b>
        <select id="filtro"></select>
        <br/>
        <button id="buscar">Buscar</button>
      </div>
      <br/>
      <table className="table table-striped table-sm table-dark" id="tablaAsistencias">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Grupo</th>
              <th>Fecha</th>
              <th>Unidad</th>
              <th>Asistencias</th>
            </tr>
          </thead>
          <tbody id="tablaAsistenciasBody">
              <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
          </tbody>
      </table>
    </div>
  );
}

var modelos = (
  <div>
    <Modelo id="curso" name="Curso" />
    <Modelo id="grupo" name="Grupo" />
    <Modelo id="unidad" name="Unidad" />
  </div>
);

ReactDOM.render(modelos, document.querySelector('#modelos'));
ReactDOM.render(<Dropbox/>, document.querySelector('#dropdiv'));
ReactDOM.render(<TablaAsistencias/>, document.querySelector('#tablaasistenciasdiv'));