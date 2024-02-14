const puppeteer = require('puppeteer');

async function runPuppeteer(url){
    const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],}).then((newBroswer)=>{
      console.log("Browser has started");
      return newBroswer;
    });
    const page = await browser.newPage();
      let state = "alive", requestState = "incomplete", minutes = 10;
      let timeId = setTimeout(timedShutdown, minutes * 60 * 1000);
    //Telling the parent process that puppeteer is ready

    //Get request
    process.on('message', async (message) => {
      console.log('Child: Response to send');
      url = message.url;
      state = message.state;
      requestState = message.requestState;
      if(requestState === "incomplete" && !page.isClosed()){
        console.log('Child: Before going to url');
        await page.goto(url, {waitUntil: 'domcontentloaded'});
        console.log('Child: After going to url');
        //Get the html response from the web site
        await page.content().then(async (htmlContent) => {
          console.log('Child: After getting page content');

          //Send response
          process.send({
            data: htmlContent,
            source: "pup"
          });
          console.log('Child: After sending page content');
        });
          requestState = "complete";
          console.log( "Child: " + requestState + " :: "+ url);
            clearTimeout(timeId);
            timeId = setTimeout(timedShutdown, minutes * 60 * 1000);
      }
    });
async function timedShutdown(){
  await page.close();
    console.log('Child: Closed page ---');
  await browser.close();
    console.log('Child: Closed Browser ---');
  process.exit(0);
    }    
}

  let url = process.argv[2];
    if(!url){
      url = 'file:///C://';
    }

runPuppeteer(url);

//Graceful shutdown
process.on('SIGTERM', (code, signal) => {
  console.log('Exit Code(SIGTERM):', code, "signal:", signal);
});
process.on('SIGINT', (code, signal) => {
  console.log('Exit Code(SIGINT):', code, "signal:", signal);
});
process.on('exit', (code) => {
  console.log('Exit Code:', code);
});