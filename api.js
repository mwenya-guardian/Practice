const puppeteer = require('puppeteer');
const express = require('express');
const https = require('https');
const http = require('http');
const httpApp = express();
const path = require('path');
const fs = require('fs');
const app = express();
const port = 443;

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

//Redirecting all the http request to the https server
httpApp.get('*', (req, res) =>{
    res.redirect('https://' + req.headers.host + req.url);
});

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
app.get('/file*', async (req, res) =>{
    const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],});
    const page = await browser.newPage();
    let fileURL = 'file:///C://';
    if(req.url !== '/file'){
      fileURL = fileURL + req.url.replace('/file/', '');
    } //else if(req.url !== '/file/Z'){
        //fileURL = fileURL.replace('C'); + req.url.replace('/file/Z', '');
      //}
    if(req.url.indexOf('.') >= 0){
      const filePath = fileURLToPath(fileURL);
      console.log(filePath);
      res.sendFile(filePath);
    } else{
      await page.goto(fileURL);
      //Get the html response from the web site
      let htmlContent = await page.content();
      let templateFile = fs.readFileSync('files/fileTransfer.html', 'utf-8');
      htmlContent = htmlContent.slice(htmlContent.indexOf('<head>') + 6, htmlContent.lastIndexOf('</head>'));
      templateFile = templateFile.slice(0, templateFile.indexOf('</body>')) + htmlContent + "</body></html>";
      await fs.writeFileSync('files/temp.html',templateFile);
      res.sendFile(path.join(__dirname, "\\files\\temp.html"));
      console.log(fileURL);
    }
    //Close browser
    let timer;
    function startTimer(minutes){
      const delay = minutes * 60 * 1000;
      return new Promise((resolve, rejects) => {
        timer = setTimeout(() => {
          resolve();
        }, delay);
      });
    }
    function restTimer(){
      clearTimeout(timer);
      startTimer(20);
    }
    startTimer(20).then(() =>{
      browser.close().then(()=>{
        console.log('Browser closed');
      });
    });
    restTimer();
});

//-------------------------------------
//Redirecting http requests to https
http.createServer(httpApp).listen(80, () =>{
  console.log("Redirecting http requests to https");
});
//Listening to the port
server.listen(port, ()=> {
  console.log('REST API is listening at https://localhost:' + port);
});




//---------------------------------------------------------------------------------
//Previous api functions
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
const { url } = require('inspector');
const { fileURLToPath } = require('url');
const { rejects } = require('assert');
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