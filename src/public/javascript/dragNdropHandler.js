class dragNdropHandler {
	constructor(dropZone, fileHandler) {
		this.dropZone = dropZone;
		this.dropZone.ondragover = (e) => this.OnDragOver(e);
		this.dropZone.ondrop = (e) => this.OnDrop(e);
		this.fileHandler = fileHandler;
	}
	OnDragOver(e) {
		e.preventDefault();
		e.currentTarget.classList.add("dragOver");
	}
	OnDrop(e) {
		e.preventDefault();
		if (e.dataTransfer.files.length !== 0) {
			this.fileHandler.addFiles(e.dataTransfer.files);
		}
	}
}