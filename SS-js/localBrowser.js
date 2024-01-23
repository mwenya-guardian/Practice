const puppeteer = require('puppeteer');
let webContent = async () => {
  const browser = await puppeteer.launch({args: ['--ignore-certificate-errors'],});
  const page = await browser.newPage();
  await page.goto('file:///C://');
  //Get the html response from the web site
  const htmlContent = await page.content();
  //Close browser
  await browser.close();
  return htmlContent;
  }
  /**
   *     let htmlContent = await page.evaluate(() =>{
      let pageText = document.querySelectorAll(':not([hidden]):not([aria-hidden="true"]):not([style*="display: none"])');
      return Array.from(pageText).map(element => element.textContent).join('\n');
    });
   * /

module.exports = { webContent }