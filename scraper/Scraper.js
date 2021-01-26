const config = require("../config.json");
const moment = require("moment");
const puppeteer = require('puppeteer');
const Discord = require('discord.js');
const TxStatePark = require('./TxStatePark');

module.exports = class Scraper {

	constructor() {
    this.txStateParks = new TxStatePark();
  }

  async startBrowser() {
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

    return browser;
  }

  async scrapeParkInfo(messageWithUrl) {
    return await this.txStateParks.scrapeParkInfo(messageWithUrl, await this.startBrowser());
  }

}
