// Import dependencies
const DbdApi = require('./apis/dbd/DbdApi');
const GoogleMapsApi = require('./apis/googlemaps/GoogleMapsApi');
const DarkSkyApi = require('./apis/darksky/DarkSkyApi');
const HiRezApi = require('./apis/hirez/HiRezApi');
const TxStatePark = require('./tx-state-park/TxStatePark');

const ADRIANS_ID = '179314473088188417';
const ANNAS_ID = '181522225835409408';
const BOT_ID = '358256950250700805';
const TARGET_CHANNELS = 'test,bot-cmds';

let tagObj = {};
let regex = /[#]\w*/g;

module.exports = class BotResponse {
    constructor() {
        this.dbdApi = new DbdApi();
        this.googleMapsApi = new GoogleMapsApi();
        this.darkSkyApi = new DarkSkyApi();
        this.hirezApi = new HiRezApi();
        this.txStatePark = new TxStatePark();
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
      let coord, data, playerStatus;

      // TODO: Make better short commands,
      // and add the long commands
      if (true) {
          switch (cmd) {
              case "!weather":
                  coord = await this.googleMapsApi.getCoordinates(msgContent);
                  data = await this.darkSkyApi.getFormattedForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
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
                      await this.dbdApi.getShrine()
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
                  // do nothing
          }
      }

      // TODO: Convert the rest to switch style

      if (msgContent === '!ping') {
          msg.reply("ping\tping\tping\nping");
      }
      else if (msgContent.includes("https://tpwd.texas.gov/state-parks/")) {
        msg.reply(
          await this.txStatePark.scrapeParkInfo(msgContent)
        );
      }
  }
}