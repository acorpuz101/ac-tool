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
  }

  async routeMessage(msg) {
      // Messages from the bot itself are ignored
      if (msg.author.id == BOT_ID || msg.author.name == 'ajon-tools') return;

      // Only messages in the target channel will be replied to
      if (!TARGET_CHANNELS.includes(msg.channel.name)) return;

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
      else if (msgContent === '!hr-connect') {
          await this.hirezApi.createSession();
          msg.reply(
              await this.hirezApi.statusOfServer() 
          );
          console.log(
              await this.hirezApi.getPlayerIdByName("ryphex")    
          );
      } else if (msgContent.match(regex) != null) {
          console.log(msg);
          msg.reply(msg.id);
      }
  }
}