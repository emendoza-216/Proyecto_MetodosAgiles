/* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
function dropDown(id) {
  var dropdown = document.getElementById(id);
  var dropdownContent = dropdown.nextElementSibling;

  dropdown.classList.toggle("active");
  if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
  } else {
      dropdownContent.style.display = "block";
  }
}
function dropHandler(event) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();

  if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {   
              var file = event.dataTransfer.items[i].getAsFile();
              var fileExtension = file.name.split('.').pop();
              //El profe dijo que aceptara de cualquier tipo: var aceptedExtension = "csv";
              if (true) { //aceptedExtension === fileExtension) {     
                  //do something
                  console.log('... file[' + i + '].name = ' + file.name);
              } else {
                  console.log("isn't .csv file");
              }
          }
      }
  } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
      }
  }
}

function dragOverHandler(event) {
  console.log('File(s) in drop zone'); 

  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();
}
