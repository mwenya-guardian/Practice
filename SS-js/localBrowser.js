const puppeteer = require('puppeteer');
  let runPuppeteer = async (url) => {
    const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],});
    const page = await browser.newPage();
      let state = "alive", requestState = "incomplete", minutes = 20;
      let timeId = setTimeout(async () => {
          await page.close();
          await browser.close().then(() => {
            console.log('Child: Closed Browser---');
          });
          console.log('Child: Closed---');
        }, minutes * 60 * 1000);
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
            timeId = setTimeout(async () => {
              await page.close();
              await browser.close().then(() => {
                console.log('Child: Closed Browser---');
              });
              console.log('Child: Closed---');
            }, minutes * 60 * 1000);
      }
    });     
  }

  let url = process.argv[2];
    if(!url){
      url = 'file:///C://';
    }
  runPuppeteer(url);