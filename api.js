const { fork } = require('child_process');
const express = require('express');
const { fileURLToPath } = require('url');
const https = require('https');
const http = require('http');
const path = require('path');
const httpApp = express();
const fs = require('fs');
const app = express();
const port = 3001;
const httpPort = 3000;
let puppeteerChildProcess = {};
setTimeout(() => {
  if(puppeteerChildProcess.connected == undefined)
    puppeteerChildProcess = fork(path.join(__dirname,'\\SS-js\\localBrowser.js'));
}, 3000);
//Access the https cetification and key
const options = {
  key: fs.readFileSync('certification/key.pem'),
  cert: fs.readFileSync('certification/cert.pem'),
  passphrase: 'guardian1',
}
//Create an https encryted server
const server = https.createServer(options, app);

//Prepares express to handle static files requests
app.use(express.static('public'));

//Redirecting all the http request to the https server
httpApp.get('*', (req, res) =>{
    res.redirect('https://' + String(req.headers.host).split(":")[0] +":" + port + req.url);
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
// Testing puppteer
app.get('/file*', async (req, res) =>{
  let fileURL = 'file:///C://';
    if(!('connected' in puppeteerChildProcess))
      puppeteerChildProcess = await fork(path.join(__dirname,'\\SS-js\\localBrowser.js'), [fileURL]);
        if(req.url !== '/file'){
          fileURL = fileURL + req.url.replace('/file/', '');
        } 
          if(req.url.indexOf('.') >= 0){
            const filePath = fileURLToPath(fileURL);
            console.log(filePath);
            res.sendFile(filePath);
          } else {
              await puppeteerChildProcess.send({
                url: fileURL,
                state: "alive",
                requestState: "incomplete"
              });
              //Get the html response from the web site
              await puppeteerChildProcess.on('message', async (response)=> {
                  //if(response.source === "pup")
                    let htmlContent = response.data;
                    let templateFile = fs.readFileSync('files/fileTransfer.html', 'utf-8');
                      htmlContent = htmlContent.slice(htmlContent.indexOf('<head>') + 6, htmlContent.lastIndexOf('</head>'));
                      templateFile = templateFile.slice(0, templateFile.indexOf('</body>')) + htmlContent + "</body></html>";
                    await fs.writeFileSync('files/temp.html',templateFile);
                    res.sendFile(path.join(__dirname, "\\files\\temp.html"));
                  
              });
            console.log(fileURL +"::"+ puppeteerChildProcess.connected);
          }
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
app.use(express('body-parser'));
app.use(express.json());
//Post data retrieval
app.post('/find', (req, res) =>{
  let request = req.body;
  books.response = request;
  console.log("POSTED");
  res.json(books);
});


//---------------------------------------------------------------------------------
//Previous api functions
//---------------------------------------------------------------------------------
//Sample data
let books = {
 data: {id: 1, title: "Book 1", author:"Author 1"},
 datat: {id: 1, title: "Book 1", author:"Author 1"}
}
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
//Listening
//---------------------------------------------------------------------------------
//http-https Redirection
http.createServer(httpApp).listen(httpPort, () =>{
  console.log("Redirecting http requests to https");
});
//Listening to the port
server.listen(port, ()=> {
  console.log('REST API is listening at https://localhost:' + port);
});
