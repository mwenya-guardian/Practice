const puppeteer = require('puppeteer');

  let runPuppeteer = async (url) => {
    const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],});
    const page = await browser.newPage();
      let state = "alive", requestState = "incomplete", minutes = 1;
      let timeId = setTimeout(async () => {
          await page.close();
          await browser.close();
        }, minutes * 60 * 1000);

    //Get request
    process.on('message', async (message) => {
      url = message.url;
      state = message.state;
      requestState = message.requestState;
      if(requestState === "incomplete"){
        await page.goto(url);
        //Get the html response from the web site
        const htmlContent = await page.content();
        //Send response
        process.send({
          data: htmlContent,
          source: "pup"
        });
          requestState = "complete";
          console.log(requestState + " :: "+ url);
          
      }
      clearTimeout(timeId);
      timeId = setTimeout(async () => {
        await page.close();
        console.log('Closed---');
        await browser.close();
      }, minutes * 60 * 1000);
    });     
  }

  let url = process.argv[2];
    if(!url){
      url = 'file:///C://';
    }
  runPuppeteer(url);