const config = require("../config.json");
const moment = require("moment");
const puppeteer = require('puppeteer');
const Discord = require('discord.js');

module.exports = class TxStatePark {

	constructor() {

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

  getUrlFromMessage(messageWithUrl) {
    // Search message for url with regex
    const urlIndexStart = messageWithUrl.search(/https?:\/\/?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);

    // Remove all non-url text from the beginning of the string
    const noLeadingText = messageWithUrl.substring(urlIndexStart, messageWithUrl.length);

    // Split up the trailing non-url text and return the first result
    return noLeadingText.split(" ")[0]
  }

  async scrapeParkInfo(messageWithUrl) {

    const parkUri = this.getUrlFromMessage(messageWithUrl);

    const browser = await this.startBrowser();

    let page = await browser.newPage();

    await page.goto(parkUri);

    let text = await page.evaluate(
      () => {
         return {
          "parkName" : document.querySelector("#sp_title > h1 > a").innerText,
          "reservationsUrl" : document.querySelector("div.rowcontent > h5 > a").href,
          "parkMapUrl" : document.querySelector("ul.sp_link_list").children[0].children[0].href,
          "trailMapUrl": document.querySelector("ul.sp_link_list").children[1].children[0].href,
          "pageUrl": document.querySelector("body").baseURI,
          "address": document.querySelector("#right-column > .portletWrapper > .parkportletrow > .contact_info > .address").innerText
          }
      }
    )

    await browser.close();

    return this.createStateParkEmbed(text);
  }

  createStateParkEmbed(parkData) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#008061')
      .setTitle(parkData.parkName)
      .setURL(parkData.pageUrl)
      //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
      .setDescription("[" + parkData.address + "](https://www.google.com/maps/search/?api=1&query=" + parkData.address.replace(/\s/g, "+") + ")")
      //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
      .addFields(
        { name: 'Reservations', value: '[URL](' + parkData.reservationsUrl + ')', inline: true },
        // { name: '\u200B', value: '\u200B' },
        { name: 'Park Map', value: '[URL](' + parkData.parkMapUrl + ')', inline: true },
        { name: 'Trail Map', value: '[URL](' + parkData.trailMapUrl + ')', inline: true },
      )
      //.addField('Inline field title', 'Some value here', true)
      //.setImage('https://i.imgur.com/wSTFkRM.png')
      .setTimestamp()
      .setFooter('Scraped with Puppeteer');

    return exampleEmbed;
  }

}
