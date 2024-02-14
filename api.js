const { fork } = require('child_process');
const express = require('express');
const { fileURLToPath } = require('url');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const path = require('path');
const httpApp = express();
const fs = require('fs');
const app = express();
const port = 3001;
const httpPort = 3000;
let puppeteerChildProcess = fork(path.join(__dirname,'\\SS-js\\localBrowser.js'));

//Access the https cetification and key
const options = {
  key: fs.readFileSync('certification/key.pem'),
  cert: fs.readFileSync('certification/cert.pem'),
  passphrase: 'guardian1',
}

//Create an https encryted server
const server = https.createServer(options, app);

//Redirecting all the http request to the https server
httpApp.get('*', (req, res) =>{
    res.redirect('https://' + String(req.headers.host).split(":")[0] +":" + port + req.url);
});

//---------------------------------------------------------------------------------
//Handling get requests
//---------------------------------------------------------------------------------
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
app.get('/file*fscript', (req, res) => {
  const filePath = path.join(__dirname, "files\\fscript.js");
  res.sendFile(filePath);
});
app.get('/file*style', (req, res) => {
  const filePath = path.join(__dirname, "files\\style.css");
  res.sendFile(filePath);
});
app.get('/file*script', (req, res) => {
  const filePath = path.join(__dirname, "files\\script.js");
  res.sendFile(filePath);
});
// Testing puppteer
app.get('/file*', async (req, res) =>{
  let fileURL = 'file:///C://';
  let isFile = parseInt(req.query.id);
  
    //Restart puppeteer if not active
    if(puppeteerChildProcess == undefined){
      puppeteerChildProcess = fork(path.join(__dirname,'\\SS-js\\localBrowser.js'));
      console.log(puppeteerChildProcess.connected, ":: Child process restarted");
    }
        //Create url to be sent to puppeteer
        if(req.url !== '/file'){
          fileURL = fileURL + req.url.replace('/file/', '');
        } 
          //Handle file trancfer(sending) to the client
          if(isFile == 1){
            const filePath = fileURLToPath(fileURL);
            console.log(filePath, '\n\n');
            res.sendFile(filePath);
          } else if(puppeteerChildProcess.channel != undefined){
            console.log('Parent: Before sending to puppeteerChildProcess');
              puppeteerChildProcess.send({
                url: fileURL,
                state: "alive",
                requestState: "incomplete"
              });
              console.log('Parent: After sending to puppeteerChildProcess');
              //Get the html response from the web site
              puppeteerChildProcess.on('message', (response)=> {
                console.log('Parent: After receiving from child');
                  if(!res.headersSent && response.source === "pup"){
                    let htmlContent = response.data;
                    console.log('Parent: After getting htmlContent');
                    let templateFile = fs.readFileSync('files/fileTransfer.html', 'utf-8');
                    console.log('Parent: After reading transfer.html');
                      htmlContent = htmlContent.slice(htmlContent.indexOf('<head>') + 6, htmlContent.lastIndexOf('</head>'));
                      templateFile = templateFile.slice(0, templateFile.indexOf('</body>')) + htmlContent + "</body></html>";
                      console.log('Parent: Before writing to temp');
                    fs.writeFileSync('files/temp.html',templateFile);
                    console.log('Parent: After writing to temp and before sending');
                    res.sendFile(path.join(__dirname, "\\files\\temp.html"));
                    console.log('Parent: After sending \n\n');
                  }
              });
            console.log(fileURL +" ::"+ puppeteerChildProcess.connected + ":: app.get(file)-Done");
          }else {
            res.status(404).send(`Apologies information can not be processed:` + 
                `${puppeteerChildProcess.channel}\n`, '<h1>Please Try Refreshing The PAGE!!!</h1>');
            puppeteerChildProcess = undefined;
          }
});

//Respones of a certain file type
app.get('/videos/:episode', (req, res)=> {
  if(parseInt(req.params.episode) == "00")
    res.sendFile("C:\\Users\\Lenovo\\Downloads\\videos\\Windows\\Microsoft Excel Tutorial for Beginners - Full Course.mp4");
  else if(parseInt(req.params.episode) == 100)
    res.sendFile(path.join(__dirname, "video\\Trevor Noah Son of Patricia 1.mp4"));
});

//---------------------------------------------------------------------------------
//Handling post requests
//---------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Post data retrieval
app.post('/find', (req, res) =>{
  let request = req.body;
  books.response = request;
  console.log("POSTED");
  res.json(books);
});

//---------------------------------------------------------------------------------
//Handling delete requests
//---------------------------------------------------------------------------------
app.get('/delete*', (req, res)=>{
  let fileURL = 'file:///C://';
  let fileName = req.query.url;
  fileURL = fileURL + req.url.replace('/delete/', '');
  const filePath = fileURLToPath(fileURL);
  console.log(filePath,"DELETED",'\n\n');
  try{
  fs.unlinkSync(filePath);
  }catch(error){
    console.error("Error:", error.message);
  }finally{
    res.redirect('back');
  }
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


//---------------------------------------------------------------------------------
//Graceful shutdown OF CHILD PRROCESS
//---------------------------------------------------------------------------------
puppeteerChildProcess.on('exit', (code, signal)=>{
  puppeteerChildProcess = undefined;
  if(code == 0){
    console.info("Child terminated");
  } else {
    console.error("Child terminated unexpextedly code:", code, " signal:", signal);
  }
});
puppeteerChildProcess.on('error', (err)=>{
  puppeteerChildProcess = undefined;
  console.error("Child terminated because of error:", err);
});
//---------------------------------------------------------------------------------
//Graceful shutdown function
//---------------------------------------------------------------------------------
function GracefulShutDown(){
  fs.unlinkSync(path.join(__dirname, "\\files\\temp.html"), (error) => {
    if(error){
      console.error(`Error: deleting failed - ${error}`);
    } else {
        console.log('Temp: Deleted');
      }
  });
}
//Graceful shutdown
process.on('SIGINT', GracefulShutDown);
process.on('SIGTERM', GracefulShutDown);
/**
 * //Graceful shutdown
  process.on('exit', (code) => {
    GracefulShutDown();
    console.log('Exit Code:', code);
  });
 */
