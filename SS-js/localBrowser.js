const puppeteer = require('puppeteer');
let flag = false;
webContent = ( async() => {
  const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],});
  const page = await browser.newPage();
  await page.goto('file:///C://');

  //Get the html response from the web site
  const htmlContent = await page.content().then((pageContent)=>{
    flag = true;
    return pageContent;
  });
  //Close browser
  await browser.close();
  return htmlContent;
  }
)();
  
while(true){
  if(flag){
  console.log(webContent);
  break;
  }
}

//module.exports = { webContent }