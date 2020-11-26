class fileHandler{
	constructor(dropZone, button) {
		this.fileList = [];
		this.dropZone = dropZone;
		button.onclick = () => this.uploadFiles();
	}
	addFiles(files) {
		for (let file of files) {
			this.fileList.push(file);
			let img = document.createElement("IMG");
			img.src = "../images/file_icon_v2.png";
			img.title = file.name;
			this.dropZone.appendChild(img);
		}
	}
	uploadFiles() {
		if (this.fileList.length !== 0) {
			let data = new FormData();
			for (let file of this.fileList) 
				data.append('files[]', file, file.name);
			fetch('/asistencias', {
				method: 'POST', body: data,
			}).then(function(res) {
				console.log('Status', res);
				alert("Archivos subidos exitosamente");
			}).catch(function(e) {
				console.log('Error', e);
				alert("Error: " + e);
			});
		} else {
			alert("No hay archivos para subir");
		}
	}
}