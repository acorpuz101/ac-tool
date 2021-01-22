// Import dependencies
const https = require('https');
const fetch = require("node-fetch");
const config = require("./config.json");

const DbdApi = require('./apis/dbd/DbdApi');
const GoogleMapsApi = require('./apis/googlemaps/GoogleMapsApi');
const DarkSkyApi = require('./apis/darksky/DarkSkyApi');
const HiRezApi = require('./apis/hirez/HiRezApi');

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

      console.log(
          await this.hirezApi.checkIfSessionIsValid()
      )

      let msgContent = msg.content;
      if (msgContent === '!ping') {
          msg.reply("ping\tping\tping\nping");
      }
      else if (msgContent.includes('!weather')) {
          const coord = await this.googleMapsApi.getCoordinates(msgContent);
          let data = await this.darkSkyApi.getFormattedForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
          msg.reply(
              data
          );
      }
      else if (msgContent.includes('!hourly-w')) {
          const coord = await this.googleMapsApi.getCoordinates(msgContent);
          let data = await this.darkSkyApi.getHourlyForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
          msg.reply(
              data
          );
      }
      else if (msgContent.includes('!week-w')) {
          const coord = await this.googleMapsApi.getCoordinates(msgContent);
          let data = await this.darkSkyApi.getEightDayForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
          msg.reply(
              data
          );
      }
      else if (msgContent.includes('!coord')) {
          msg.reply(
              await this.googleMapsApi.getFormattedCoordinates(msgContent)
          );
      }
      else if (msgContent === '!dbd shrine') {
          msg.reply(
              await this.dbdApi.getShrine()
          );
      }
      else if (msgContent.includes('!smite-playerInfo') || msgContent.includes('!smite-pi')) {
          msg.reply(
              await this.hirezApi.getPlayerInfo(msgContent)    
          );
      }
      else if (msgContent === '!smite-server-status' || msgContent === "!smite-ss") {
          msg.reply(
              await this.hirezApi.statusOfServer() 
          );
      }
      else if (msgContent === '!smite-motd' || msgContent === "!smotd") {
          msg.reply(
              await this.hirezApi.getMotd() 
          );
      }
      else if (msgContent.includes('!smite-match-history') || msgContent.includes("!smite-mh")) {
          console.log(
              await this.hirezApi.getMatchHistoryByPlayerName(msgContent)
          );
      }
      else if (msgContent.includes('!smite-god-ranks') || msgContent.includes("!sgr")) {
          msg.reply(
              await this.hirezApi.getGodKdr(msgContent)
          );
      }
      else if (msgContent.includes('!smite-kda-allgods') || msgContent.includes("!skda")) {
          msg.reply(
              await this.hirezApi.getKdrAcrossAllGods(msgContent)
          );
      }
      else if (msgContent.includes('!smite-account-info') || msgContent.includes("!sai")) {
          msg.reply(
              await this.hirezApi.getPlayerAccount(msgContent)
          );
      }
      else if (msgContent.includes('!smite-match-status') || msgContent.includes("!sms")) {
          let playerStatus = await this.hirezApi.getPlayerStatus(msgContent);
          let matchId = playerStatus[0].Match;
          console.log(
          //msg.reply(
              matchId
          );
          let matchInfo = await this.hirezApi.getMatchStatus(matchId);
          msg.reply(
              matchInfo
          )
      } else if (msgContent.match(regex) != null) {
          console.log(msg);
          msg.reply(msg.id);
      }
  }
}