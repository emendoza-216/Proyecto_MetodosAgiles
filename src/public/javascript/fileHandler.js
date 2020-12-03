class fileHandler{
	constructor(dropZone, button) {
		this.fileList = [];
		this.dropZone = dropZone;
		this.button = button;
		this.subido = false;
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

		if(this.subido == false){ //primera vez que se sube un archivo
			this.subido = true;
			
			var sel = document.getElementById("cursoDeseado");

			fetch('/cursos', {
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

			sel.removeAttribute("hidden");
			this.button.removeAttribute("disabled");

			var sel2 = document.getElementById("grupoDeseado");
			function cambio(){
				fetch('/grupos/'+sel.value, {
					method: 'GET', 
				})
				.then(res => res.json())
				.then(function(res) {
					sel2.innerHTML = "";
					for(var i = 0; i < res.length; i++) {
						var opt = document.createElement('option');
						opt.innerHTML = res[i].nombre;
						opt.value = res[i].nombre;
						sel2.appendChild(opt);
					}
				})
				.catch(function(e) {
					console.log('Error', e);
				});

				sel2.removeAttribute("hidden");
			}
			sel.onchange = cambio;
			cambio();
		}
	}
	uploadFiles() {
		if (this.fileList.length !== 0) {
			let data = new FormData();
			
			for (let file of this.fileList) 
				data.append('files[]', file, file.name);

			data.append('archivosRecibidos', this.fileList.length);
			data.append('curso', document.getElementById("cursoDeseado").value);
			data.append('grupo', document.getElementById("grupoDeseado").value);

			fetch('/asistencias', {
				method: 'POST', body: data,
				//headers: {'Content-Type': 'multipart/form-data'},
			})
			.then(result => result.json())
			.then(function(resultado) {
				console.log('Status', resultado);
				if(resultado.res != null)
					alert(resultado.res);
			}).catch(function(e) {
				console.log('Error', e);
				alert("Error: " + e);
			});
		} else {
			alert("No hay archivos para subir");
		}
	}
}