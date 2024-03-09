function addRow(name, url, isdir,
    size, size_string, date_modified, date_modified_string) {
  if (name == "." || name == "..")
    return;

  var root = document.location.pathname;
  if (root.substr(-1) !== "/")
    root += "/";

  var tbody = document.getElementById("tbody");
  var row = document.createElement("tr");
  var file_cell = document.createElement("td");
  var link = document.createElement("a");

  //Self added code
  let button_row = document.createElement("tr");
  let upload_button_cell = document.createElement("td");
  let upload_form = document.createElement('form');
  let upload_input = document.createElement('input');
  let upload_button = document.createElement('input');
  
    upload_form.enctype = "multipart/form-data";
    upload_form.method = "POST";
    upload_form.id = "file";
    upload_input.type = "file";
    upload_input.name = "file";
    upload_button.type = "submit";
    upload_button.value = "upload";
    upload_button.name = isdir? "": url;

      //upload_form.appendChild();
  //End of self added code

  link.className = isdir ? "icon dir" : "icon file";

  if (isdir) {
    name = name + "/";
    url = url + "/";
    size = 0;
    size_string = "";
    link.href = root + url;
  } else {
    link.draggable = "true";
    link.addEventListener("dragstart", onDragStart, false);
    link.href = root + url + "?id=1";

    //SELF ADDED CODE
    let delete_button_cell = document.createElement("td");
    let delete_form = document.createElement('form');
    let delete_button = document.createElement("input");
      button_row.className = "hide";
      delete_form.method = "DELETE";
      delete_button.type = "submit";
      delete_button.value = "DELETE";
      delete_button.className = "button";
      
        delete_form.action = link.href.replace("file", "delete");
        button_row.id = url;
          delete_form.appendChild(delete_button);
          delete_button_cell.appendChild(delete_form);
          button_row.appendChild(delete_button_cell);
    //END OF SELF
  }
  link.innerText = name;

  
  file_cell.dataset.value = name;
  file_cell.appendChild(link);

  row.appendChild(file_cell);
  let size_cell = createCell(size, size_string);
  let date_cell = createCell(date_modified, date_modified_string);

  size_cell.setAttribute("onclick", `show("${url}")`);//Self
  date_cell.setAttribute("onclick", `show("${url}")`);//Self

  row.appendChild(size_cell);
  row.appendChild(date_cell);

  tbody.appendChild(row);
  tbody.appendChild(button_row); //Self
}

function onDragStart(e) {
  var el = e.srcElement;
  var name = el.innerText.replace(":", "");
  var download_url_data = "application/octet-stream:" + name + ":" + el.href;
  e.dataTransfer.setData("DownloadURL", download_url_data);
  e.dataTransfer.effectAllowed = "copy";
}

function createCell(value, text) {
  var cell = document.createElement("td");
  cell.setAttribute("class", "detailsColumn");
  cell.dataset.value = value;
  cell.innerText = text;
  return cell;
}

function start(location) {
  var header = document.getElementById("header");
  header.innerText = header.innerText.replace("LOCATION", location);

  document.getElementById("title").innerText = header.innerText;
  updateHeader();
}

function onHasParentDirectory() {
  var box = document.getElementById("parentDirLinkBox");
  box.style.display = "block";

  var root = document.location.pathname;
  if (!root.endsWith("/"))
    root += "/";

  var link = document.getElementById("parentDirLink");
  link.href = root + "..";
}

function sortTable(column) {
  var theader = document.getElementById("theader");
  var oldOrder = theader.cells[column].dataset.order || '1';
  oldOrder = parseInt(oldOrder, 10)
  var newOrder = 0 - oldOrder;
  theader.cells[column].dataset.order = newOrder;

  var tbody = document.getElementById("tbody");
  var rows = tbody.rows;
  var list = [], i;
  for (i = 0; i < rows.length; i++) {
    list.push(rows[i]);
  }

  list.sort(function(row1, row2) {
    var a = row1.cells[column].dataset.value;
    var b = row2.cells[column].dataset.value;
    if (column) {
      a = parseInt(a, 10);
      b = parseInt(b, 10);
      return a > b ? newOrder : a < b ? oldOrder : 0;
    }

    // Column 0 is text.
    if (a > b)
      return newOrder;
    if (a < b)
      return oldOrder;
    return 0;
  });

  // Appending an existing child again just moves it.
  for (i = 0; i < list.length; i++) {
    tbody.appendChild(list[i]);
  }
}

// Add event handlers to column headers.
function addHandlers(element, column) {
  element.onclick = (e) => sortTable(column);
  element.onkeydown = (e) => {
    if (e.key == 'Enter' || e.key == ' ') {
      sortTable(column);
      e.preventDefault();
    }
  };
}

function onLoad() {
  addHandlers(document.getElementById('nameColumnHeader'), 0);
  addHandlers(document.getElementById('sizeColumnHeader'), 1);
  addHandlers(document.getElementById('dateColumnHeader'), 2);
  document.getElementById("uploadform").action = window.location.href.replace('file','upload');
  updateHeader();
}

window.addEventListener('DOMContentLoaded', onLoad);

loadTimeData.data = {
  "header":"Index of LOCATION",
  "headerDateModified":"Date modified",
  "headerName":"Name","headerSize":"Size",
  "language":"en","parentDirText":"[parent directory]",
  "textdirection":"ltr"};

//--------------------------------------------------------------
//Update Header Function
//--------------------------------------------------------------
function updateHeader(){
  let parentElement = document.getElementById("header");
  let urlPath = window.location.pathname;
  document.getElementById("home").setAttribute('href', window.location.protocol + "//" + window.location.host);
  for(let id = 1; id < urlPath.split("/").length -1; id++){
     let newElement = document.createElement("a");
     let tempPath = '', pathName;
      for(let count = 0; count <= id; count++){
        tempPath += urlPath.split("/")[count] +  "/";
        pathName = urlPath.split("/")[id] + "\\";
        //console.log( tempPath + ":::" + pathName + ":::" + urlPath.split("/") + ":::" + urlPath.split("/").length + ":::" + urlPath);
      }
        tempPath = window.location.protocol + "//" + window.location.host + tempPath;
        newElement.setAttribute("href",tempPath);
        newElement.setAttribute("id",'' + id);
        newElement.textContent = decodeURIComponent(pathName);
  parentElement.appendChild(newElement);
  }
};
//Replace string function
function replaceAll(string, searchString, replaceString=""){
  while(string.indexOf(searchString) >= 0){
    string = string.replace(searchString, replaceString);
  }
  return string;
}
//CSS manipulation
function show(id){
  if(document.getElementById(id).getAttribute('class') == 'show')
    document.getElementById(id).setAttribute('class','hide');
  else
    document.getElementById(id).setAttribute('class','show');
  console.log(id);
}
//Update the progress Bar
function updateProgress(event){
  var progressBar = document.getElementById('progressBar');
  var percetText = document.getElementById('progressPercent');
  console.log('bar update called');
  if(event.lengthComputable){
    var percentComplete = (event.loaded/event.total) * 100;
    progressBar.style.width = percentComplete + '%';
    percetText.innerText = String(percentComplete).substring(0, 4) + '%';
  }
}
//Upload the file
function uploadFile(file){
  var xhr = new XMLHttpRequest();
  console.log('xhr Object Created');
  var formData = new FormData();
  formData.append('file', file);
  xhr.upload.addEventListener('progress', updateProgress);
  xhr.onload = function(){
    if(xhr.status == 200){
      window.location.href = window.location.href;
    }
  }
  console.log('progress listener added');
  xhr.open('POST', window.location.pathname.replace('file', 'upload'), true);
  showProgressBar('block');
  xhr.setRequestHeader('enctype', "multipart/form-data");
  xhr.send(formData);
  console.log('file sent');
}
//Show/hide the progress bar
function showProgressBar(display){
  var container = document.getElementById('progressContainer');
  container.style.display = display;
  console.log('Showed block');
}
//Add listener
var uploadform = document.getElementById('uploadform');
uploadform.addEventListener('submit', function(event){
  event.preventDefault();
  var fileInput = document.getElementById('fileInput');
  console.log('Add Listener');
  var file = fileInput.files[0];
  uploadFile(file);
});
/**
//JQuery test
$(document).ready(function(){
  $("p").hide();
  $("tr").click(function(){
    $(this).next().slideToggle(300);
  });
});
**/