const puppeteer = require('puppeteer');
let webContent = undefined;
webContent = ( async() => {
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true,});
  const page = await browser.newPage();
  await page.goto('https://localhost:3000/');

  //Get the html response from the web site
  const htmlContent = await page.content();
  //console.log(htmlContent);
  //close browser
  await browser.close();
  return htmlContent;
  }
)().then((htmlContent)=>{
  return htmlContent;
});
  
while(webContent == undefined);
console.log(webContent);

//module.exports = { webContent }