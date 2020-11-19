function Modelo(props) {
  const btnAgregar = "btnAgregar" + props.name;
  const btnModificar = "btnModificar" + props.name;
  const btnBorrar = "btnBorrar" + props.name;

  const formId = "forma" + props.name;
  const selectId = "select" + props.name;
  const error = "error" + props.name;

  return (
    <div className="modelo">
      <form id={formId}>
        <select id={selectId}>
          <option>{props.name}</option>
        </select>
        <button id={btnAgregar} type="button">Agregar</button>
        <button id={btnModificar} type="button">Modificar</button>
        <button id={btnBorrar} type="button">Eliminar</button>
      </form>
      <label id={error} className="Error"></label>
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