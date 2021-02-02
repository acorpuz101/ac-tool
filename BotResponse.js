// Import dependencies
const DbdApi = require('./apis/dbd/DbdApi');
const GoogleMapsApi = require('./apis/googlemaps/GoogleMapsApi');
const DarkSkyApi = require('./apis/darksky/DarkSkyApi');
const HiRezApi = require('./apis/hirez/HiRezApi');
const Scraper = require('./scraper/Scraper');
const TwinWordApi = require('./apis/twinword/TwinWordApi');
const AylienApi = require('./apis/aylien/AylienTextAnalysisApi');
const DiscordWriter = require('./DiscordWriter');

const ADRIANS_ID = '179314473088188417';
const ANNAS_ID = '181522225835409408';
const BOT_ID = '358256950250700805';
const TARGET_CHANNELS = 'test,bot-cmds,camping';

let tagObj = {};
let regex = /[#]\w*/g;

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
    this.init();
  }

  async init() {
    await this.hirezApi.baseApiCmds.createSession();
  }

  async routeMessage(msg) {
    // Messages from the bot itself are ignored
    if (msg.author.id == BOT_ID || msg.author.name == 'ajon-tools') return;

    // Only messages in the target channel will be replied to
    if (!TARGET_CHANNELS.includes(msg.channel.name)) return;

    // Check if HiRez session is valid
    // TODO: When invaid, get a new session
    await this.hirezApi.checkIfSessionIsValid();

    // Get the message content
    let msgContent = msg.content;

    // Split the string up by each word
    let splitMsgContent = msgContent.split(" ")

    // The first word is the command
    let cmd = splitMsgContent[0];

    // Initialize variables to be used in the switch
    let coord, alternateDate = "", data, playerStatus, word, phrase, uri;


    console.log("cmd", cmd);
    // TODO: Make better short commands,
    // and add the long commands
    if (true) {
      switch (cmd) {
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
        case "!article-extract":
            uri = msgContent.split(" ")[1];
            data = await this.aylienApi.extractArticle(uri);
            //msg.reply(
            //  this.dcWriter.presentSentimentAnalysis(data, phrase)
            //);
          break;
        case "!article-summary":
            uri = msgContent.split(" ")[1];
            data = await this.aylienApi.summarizeArticle(uri);
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