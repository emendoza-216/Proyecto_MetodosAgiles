window.onload = () => {
	let dropZone = document.getElementById("dropbox");
	let uploadButton = document.getElementById("uploadButton");
	let fh = new fileHandler(dropZone, uploadButton);
	new dragNdropHandler(dropZone, fh);

	new optionHandler(document, "Curso");
	new optionHandler(document, "Grupo");
	new optionHandler(document, "Unidad");
}