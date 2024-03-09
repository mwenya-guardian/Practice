const { fork, spawn } = require('child_process');
const express = require('express');
const { fileURLToPath } = require('url');
const bodyParser = require('body-parser');
const multer =  require('multer');
const progressStream = require('progress-stream');
const https = require('https');
const http = require('http');
const path = require('path');
const httpApp = express();
const fs = require('fs');
const app = express();
const port = 3001;
const httpPort = 3000;
const upload = multer({dest: 'files/'});
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
            res.status(404);//.send(`Apologies information can not be processed:` + 
               // `${puppeteerChildProcess.channel}\n`, '<h1>Please Try Refreshing The PAGE!!!</h1>');
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

//Uploading file requests
app.post('/upload*', upload.single('file'), (req, res)=>{
  let file = req.file;
  let fileURL = 'file:///C://', oldFilePath = path.join(__dirname + '\\files');
  //Get the path used to save the file on the intended directory
  fileURL =  req.url !== '/upload'? fileURL + req.url.replace('/upload/', ''): fileURL;
    let filePath = fileURLToPath(fileURL) + file.originalname;
    //Move file to the correct directory
    fs.copyFile(file.path, filePath, (err)=>{
      if(err){
        console.error('Error: File Not Saved-', filePath);
        return res.status(500).send('Error saving file');
      }
    //Delete file from previous
    fs.unlink(file.path, (err)=>{
      if(err){
        console.error('Error: File Saved But Something Went Wrong ):');
        return res.status(500).send('Error: File Saved But Something Went Wrong ):' +
        `<a href="https://${req.headers.host}${req.url.replace('upload', 'file')}">Back</a> </a>`
        );
      }
    });
    res.sendStatus(200);
    });
});

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
    try {
      fs.unlinkSync(filePath);
    } catch(error){
        console.error("Error:", error.message);
    } finally{
        res.redirect('back');
    }
});

//---------------------------------------------------------------------------------
//Listening
//---------------------------------------------------------------------------------
//http-https Redirection
http.createServer(httpApp).listen(httpPort, () =>{
  console.log("Redirecting http requests to https");
});
//Listening for https requests
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
process.on('exit', GracefulShutDown);
