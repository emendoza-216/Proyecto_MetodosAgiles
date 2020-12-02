window.onload = () => {
	let dropZone = document.getElementById("dropbox");
	let uploadButton = document.getElementById("uploadButton");
	let fh = new fileHandler(dropZone, uploadButton);
	new dragNdropHandler(dropZone, fh);

	new optionHandler(document.getElementById("selectCurso"), "Curso");
	new optionHandler(document.getElementById("selectGrupo"), "Grupo");
	new optionHandler(document.getElementById("selectUnidad"), "Unidad");
}