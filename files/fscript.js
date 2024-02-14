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
  let button_cell = document.createElement("td");
  let form = document.createElement('form');
  let input = document.createElement('input');
  let button = document.createElement("input");

  button_row.className = "hide";
  form.method = "DELETE";
  input.name = "url";
  input.className = "hide";
  button.type = "submit";
  button.value = "DELETE";
  button.className = "button";
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
    form.action = link.href.replace("file", "delete");;
    input.value = url; //Self
    //input.id = url;   //Self
    button_row.id = url; //Self
      form.appendChild(input);
      form.appendChild(button);
        button_cell.appendChild(form);
          button_row.appendChild(button_cell);
    //END OF SELF
  }
  link.innerText = name;

  
  file_cell.dataset.value = name;
  file_cell.appendChild(link);

  row.appendChild(file_cell);
  let size_cell = createCell(size, size_string);
  let date_cell = createCell(date_modified, date_modified_string);

  size_cell.setAttribute("onclick", isdir? "":`show("${url}")`);//Self
  date_cell.setAttribute("onclick", isdir? "":`show("${url}")`);//Self

  row.appendChild(size_cell);
  row.appendChild(date_cell);

  tbody.appendChild(row);
  isdir? "":tbody.appendChild(button_row); //Self
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
        newElement.textContent = replaceAll(pathName, "%20", " ");
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
/**
//JQuery test
$(document).ready(function(){
  $("p").hide();
  $("tr").click(function(){
    $(this).next().slideToggle(300);
  });
});
**/