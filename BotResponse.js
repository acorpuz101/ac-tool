﻿// Import dependencies
const DbdApi = require('./apis/dbd/DbdApi');
const GoogleMapsApi = require('./apis/googlemaps/GoogleMapsApi');
const DarkSkyApi = require('./apis/darksky/DarkSkyApi');
const HiRezApi = require('./apis/hirez/HiRezApi');
const Scraper = require('./scraper/Scraper');
const TwinWordApi = require('./apis/twinword/TwinWordApi');
const AylienApi = require('./apis/aylien/AylienTextAnalysisApi');
const LinguaToolsApi = require('./apis/linguatools/LinguaToolsApi');
const DiscordWriter = require('./DiscordWriter');
const FileWriter = require('./FileWriter');
const moment = require("moment");
const Discord = require('discord.js');

const ADRIANS_ID = '179314473088188417';
const ANNAS_ID = '181522225835409408';
const BOT_ID = '358256950250700805';
const TARGET_CHANNELS = 'test,bot-cmds,camping';

let tagObj = {};
let regex = /[#]\w*/g;


const fetch = require("node-fetch");

module.exports = class BotResponse {
  constructor() {
    this.dbdApi = new DbdApi();
    this.googleMapsApi = new GoogleMapsApi();
    this.darkSkyApi = new DarkSkyApi();
    this.hirezApi = new HiRezApi();
    this.scraper = new Scraper();
    this.twinWordApi = new TwinWordApi();
    this.aylienApi = new AylienApi();
    this.dcWriter = new DiscordWriter();
    this.fileWriter = new FileWriter();
    this.linguaTools = new LinguaToolsApi();

    this.isDev = false; // TODO: Make this config
    this.init();
  }

  async init() {
    // TODO: Breaks when ETIMEDOUT
    // await this.hirezApi.baseApiCmds.createSession();
  }

  async routeMessage(msg) {
    // Messages from the bot itself are ignored
    if (msg.author.id == BOT_ID || msg.author.name == 'ajon-tools') return;

    // Only messages in the target channel will be replied to
    if (!TARGET_CHANNELS.includes(msg.channel.name)) return;

    // Check if HiRez session is valid
    // TODO: When invaid, get a new session
    // TODO: Breaks when ETIMEDOUT
    // await this.hirezApi.checkIfSessionIsValid();

    // Get the message content
    let msgContent = msg.content;

    // Split the string up by each word
    let splitMsgContent = msgContent.split(" ")

    // The first word is the command
    let cmd = splitMsgContent[0];

    // Initialize variables to be used in the switch
    let coord, alternateDate = "", data, playerStatus, word, phrase, uri, res, url, params, firstResult;


    console.log(moment().format("MM/DD/YY HH:mm:ss"), cmd);
    // TODO: Make better short commands,
    // and add the long commands

    if (this.isDev) {
      switch (cmd) {
        case "!new":
          url = new URL("http://localhost:3002/detectlanguage");
          params = { query: "Versicherung" };
          url.search = new URLSearchParams(params).toString();
          res = await fetch(url);
          console.log(await res.json());
          break;
        case "!npi-name":
          const firstName = splitMsgContent[1];
          const lastName = splitMsgContent[2];
          url = new URL("http://192.168.0.101:3904/searchName");
          params = {
            firstname: firstName,
            lastname: lastName
          };
          url.search = new URLSearchParams(params).toString();
          res = await fetch(url);
          data = await res.json();
          console.log(data);


          if (data.result_count > 0) {
            firstResult = data.results[0];
            msg.reply(
              `${firstResult.basic.first_name} ${firstResult.basic.last_name} - ${firstResult.basic.gender}\n` +
              `NPI:\t${firstResult.number}\n` +
              `Specialty:\t${firstResult.taxonomies[0].desc}`
            )
          } else {
            msg.reply("No Provider Found");
          }

          break;
        default:
          console.log("default")
      }
    } else {
      switch (cmd) {
        // TODO: FIX THIS SHIT
        case "!npi-name":
          const firstName = splitMsgContent[1];
          const lastName = splitMsgContent[2];
          url = new URL("http://localhost:3904/searchName");
          params = {
            firstname: firstName,
            lastname: lastName
          };
          url.search = new URLSearchParams(params).toString();
          res = await fetch(url);
          data = await res.json();
          console.log(data);


          if (data.result_count > 0) {
            firstResult = data.results[0];
            msg.reply(
              `${firstResult.basic.first_name} ${firstResult.basic.last_name} - ${firstResult.basic.gender}\n` +
              `NPI:\t${firstResult.number}\n` +
              `Specialty:\t${firstResult.taxonomies[0].desc}`
            )
          } else {
            msg.reply("No Provider Found");
          }
          break;
        case "!def":
          word = msgContent.split(" ")[1];
          data = await this.twinWordApi.getDefinition(word);
          msg.reply(
            this.dcWriter.presentDefinition(data)
          );
          break;
        case "!sa":
          if (msg.author.id != ADRIANS_ID) {
            msg.reply(`Sorry, this request is restricted due to the low number of free requests.`);
          } else {
            phrase = msgContent.replace(/[^a-zA-Z ]/g, "").split(" ").slice(1).join("+");
            data = await this.twinWordApi.getSentimentAnalysis(phrase);
            msg.reply(
              this.dcWriter.presentSentimentAnalysis(data, phrase)
            );
          }
          break;
        case "!translate":
          if (splitMsgContent.length != 3) {
            msg.reply(this.dcWriter.presentInvalidTranslateCommand());
            return;
          } else {
            const word = splitMsgContent[1];
            const langPair = splitMsgContent[2];
            const data = await this.linguaTools.translateWord(word, langPair);
            msg.reply(
              this.dcWriter.presentTranslation(data, word, langPair)
            );
          }
          break;
        case "!article-extract":
          uri = msgContent.split(" ")[1];
          data = await this.aylienApi.extractArticle(uri);
          const filePath = await this.fileWriter.createFileForArticle(data);
          msg.channel.send(
            `${data.title} by ${data.author}`,
            { files: [filePath] }
          );
          break;
        case "!article-summary":
            uri = msgContent.split(" ")[1];
            data = await this.aylienApi.summarizeArticle(uri);
            //message.channel.send(new Discord.Attachment('./emojis/killerbean.png', 'killerbean.png'))
            msg.reply(
              this.dcWriter.presentArticleSummary(data, uri)
            );
            break;
        case "!analyze-sentiment":
            phrase = msgContent.replace(/[^a-zA-Z ]/g, "").split(" ").slice(1).join("+");
            data = await this.aylienApi.analyzeSentiment(phrase);
            msg.reply(
              this.dcWriter.presentAylienSentimentAnalysis(data, uri)
              );
          break;
        case "!detect-language":
            phrase = msgContent.replace(/[^a-zA-Z ]/g, "").split(" ").slice(1).join("+");
            data = await this.aylienApi.detectLanguage(phrase);
            msg.reply(
              this.dcWriter.presentLanguageDetection(data, uri)
              );
          break;
        case "!hashtag-suggestion":
            phrase = msgContent.replace(/[^a-zA-Z ]/g, "").split(" ").slice(1).join("+");
            data = await this.aylienApi.suggestHashtags(phrase);
            msg.reply(
              this.dcWriter.presentHashtagSuggestion(data, uri)
              );
          break;
        case "!weather":
          coord = await this.googleMapsApi.getCoordinates(msgContent);
          alternateDate = msgContent.split("-")[1];
          data = await this.darkSkyApi.getFormattedForecast(coord.lat + "," + coord.lng, coord.formattedAddress, (!alternateDate) ? "" : alternateDate);
          msg.reply(
            data
          );
          break;
        case "!hourly-w":
          coord = await this.googleMapsApi.getCoordinates(msgContent);
          data = await this.darkSkyApi.getHourlyForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
          msg.reply(
              data
          );
          break;
        case "!week-w":
          coord = await this.googleMapsApi.getCoordinates(msgContent);
          data = await this.darkSkyApi.getEightDayForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
          msg.reply(
              data
          );
          break;
        case "!coord":
          msg.reply(
              await this.googleMapsApi.getFormattedCoordinates(msgContent)
          );
          break;
        case "!shrine":
          msg.reply(
            await this.dbdApi.getShrine(splitMsgContent)
          );
          break;
        case "!spi":
          msg.reply(
              await this.hirezApi.getPlayerInfo(msgContent)
          );
          break;
        case "!sss":
          msg.reply(
              await this.hirezApi.statusOfServer()
          );
          break;
        case "!smotd":
          msg.reply(
              await this.hirezApi.getMotd()
          );
          break;
        case "!sgr":
          msg.reply(
              await this.hirezApi.getGodKdr(msgContent)
          );
          break;
        case "!skda":
          msg.reply(
              await this.hirezApi.getKdrAcrossAllGods(msgContent)
          );
          break;
        case "!sai":
          msg.reply(
              await this.hirezApi.getPlayerAccount(msgContent)
          );
          break;
        case "!sps":
          playerStatus = await this.hirezApi.getPlayerStatus(msgContent);
          console.log(
          //msg.reply(
              playerStatus
          );
          break;
        case "!sms":
          playerStatus = await this.hirezApi.getMatchStatus(msgContent);
          //console.log(
          msg.reply(
              playerStatus
          );
            break;
        default:
          //console.log("default");
      }
    }

    // Keep IF/ELSE for the 'includes' logic

    if (msgContent === '!ping') {
        msg.reply("ping\tping\tping\nping");
    }
    else if (msgContent.includes("https://tpwd.texas.gov/state-parks/")) {
      msg.react('👍');
      msg.reply(
        await this.scraper.scrapeParkInfo(msgContent)
      );
    }
  }
}
