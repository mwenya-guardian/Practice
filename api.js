const { webContent } = "fdf";// require('./SS-js/localBrowser.js');
const { process_params } = require('express/lib/router');
const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

//Access the https cetification and key
const options = {
  key: fs.readFileSync('certification/key.pem'),
  cert: fs.readFileSync('certification/cert.pem'),
  passphrase: 'guardian1',
}

//Create an https encryted server
const server = https.createServer(options, app);

//Series file path access
let currentPath = "C:";
let initialPath = "MG-Movies-Series-New folder-My Teen Romantic Copmedy Went Wrong As I Expected-S2";
  initialPath = initialPath.split("-");
  initialPath.forEach(sub => {
              currentPath = path.join(currentPath, sub);    
              });
//Prepares express to handle static files requests
app.use("/S2", express.static(currentPath));
//Home page
app.get('/', (req, res)=> {
  const filePath = path.join(__dirname, "Web\\index.html");
  res.sendFile(filePath);
});
//CSS stylesheet
app.get('/style', (req, res)=> {
  const filePath = path.join(__dirname, "Web\\assets\\css\\style.css");
  res.sendFile(filePath);
});
//FrontEnd javascript
app.get('/script', (req, res) => {
  const filePath = path.join(__dirname, "Web\\assets\\js\\script.js");
  res.sendFile(filePath);
});
//Background image
app.get('/style/back', (req, res)=> {
  const filePath = path.join("C:\\Users\\Lenovo\\Downloads\\Walpapers", "webPage.jpg");
  res.sendFile(filePath);
});
//Post data retrieval
app.post('/find', (req, res) =>{
  //let request = JSON.parse(req.body);
  //books.push(request);
  console.log("POSTED");
  res.json(books);
});
// Testing puppteer
app.get('/pup', (req, res) =>{
  console.log("ppppp");
  res.json(webContent);
});
//Respones of a certain file type
app.get('/videos/:episode', (req, res)=> {
  let episode = parseInt(req.params.episode) + "";
  if(parseInt(req.params.episode) == "00"){
    res.sendFile("C:\\Users\\Lenovo\\Downloads\\videos\\Windows\\Microsoft Excel Tutorial for Beginners - Full Course.mp4");
  }
  else if(parseInt(req.params.episode) == 100){
    res.sendFile(path.join(__dirname, "video\\Trevor Noah Son of Patricia 1.mp4"));
  } else{
  episode = episode.length > 1? episode: ("0"+ episode);
  episode += " Yahari Ore no Seishun Love Come wa Machigatteiru.Zoku.mkv"
  const filePath = path.join(currentPath, episode);
  res.sendFile(filePath);
  }
});

//Listening to the port
server.listen(port, ()=> {
  console.log('REST API is listening at https://localhost:' + port);
});








//---------------------------------------------------------------------------------
//Previuos api functions
//---------------------------------------------------------------------------------
//Sample data
let books = [
  {id: 1, title: "Book 1", author:"Author 1"},
  {id: 1, title: "Book 1", author:"Author 1"}
]
//Json responses
app.get('/books', (req, res)=> {
  res.json(books);
});
app.post('/books', (req, res)=> {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});
app.put('/books/:id', (req, res) => {
  const bookId =  parseInt(req.params.id);
  const updateBook = req.body;
  books = books.map(book=> book.id !== bookId? updateBook: book);
    res.json(updateBook);
});
app.delete('/books/:id', (req, res)=> {
  const bookId = parseInt(req.params.id);
  books = books.filter(book => book.id !== bookId);
  res.sendStatus(204);
});








//---------------------------------------------------------------------------------
//Previuos function definations
//---------------------------------------------------------------------------------
const readline =  require('readline');
const req = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function sortAlg(arr){
  if(!Array.isArray(arr))
    return;
  let index = 0, temp = 0, tempIndex = 0;
    while(index <= arr.length - 1){
      temp = arr[index];
      tempIndex = index;
      for(let i = index; i < arr.length - 1; i++){
        if(temp > arr[i]){
          temp = arr[i];
          tempIndex = i;
        }
      }
    } 
}
function BinarySearch(arr, target){
  //if(!Array.isArray(arr))
    //  return "Here";
  if(sortAlg(arr) == undefined)
    return -1;
  let begin = 0, end = arr.length - 1;
  while(begin < end){
    if(target === arr[(end + begin)/2]){
      return (end + begin)/2;
    }
    else if(target > arr[(end + begin)/2]) {
      begin = (end + begin)/2;
    }
    else if(target < arr[(end + begin)/2]) {
      end = (end + begin)/2; 
    }
    else {
      return -1;
    }
  }
  return -1;
}

function toNumber(arr){
 if(!Array.isArray(arr))
    return;
  for(let i = 0; i < arr.length; i++){
    arr[i] = parseFloat(arr[i]);
  }
  return arr.forEach(function (value){
              if(isNaN(value))
                return NaN;
              });
}