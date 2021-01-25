const config = require("../config.json");
const moment = require("moment");
const puppeteer = require('puppeteer');

module.exports = class TxStatePark {

	constructor() {

	}

  async startBrowser(inputStringUrl) {
    let browser;
    try {
      console.log("Opening the browser......");
      browser = await puppeteer.launch({
        //headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
      });
    } catch (err) {
      console.log("Could not create a browser instance => : ", err);
    }

    let page = await browser.newPage();

    let site = await page.goto(inputStringUrl);

    let text = await page.evaluate(
      () => {
        let parkMapUrl = document.querySelector("ul.sp_link_list").children[0].children[0].href;
        let trailMapUrl = document.querySelector("ul.sp_link_list").children[1].children[0].href;
        return parkMapUrl;
      }
    )

    await browser.close();

    return text;
  }

}
