const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const HouseList = require('./house-fn/house-list');
const SaveAppData = require('./house-fn/SaveAppData');
const CommonUtils = require('./house-fn/CommonUtils');
const DbdApi = require('./apis/dbd/DbdApi');
const GoogleMapsApi = require('./apis/googlemaps/GoogleMapsApi');
const DarkSkyApi = require('./apis/darksky/DarkSkyApi');
const config = require("./config.json");

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

const HOUSE_SHOW_SUGGESTIONS_LIST = '!show ';
const ADRIANS_ID = '179314473088188417';
const ANNAS_ID = '181522225835409408';

const TARGET_CHANNELS = 'test,bot-cmds';

let houseList = new HouseList();
const listSaver = new SaveAppData();
const commonUtils = new CommonUtils();
const dbdApi = new DbdApi();
const googleMapsApi = new GoogleMapsApi();
const darkSkyApi = new DarkSkyApi();

let tagObj = {};
let regex = /[#]\w*/g;

client.on('message', async msg => {

  // Messages from the bot itself are ignored
  if (msg.author.id == 358256950250700805 || msg.author.name == 'ajon-tools') return;

  // Only messages in the target channel will be replied to
  if (!TARGET_CHANNELS.includes(msg.channel.name)) return;

  let msgContent = msg.content;
  if (msgContent === '!ping') {
	  msg.reply(config);
  }
  else if (msgContent.includes('!weather')) {
    const coord = await googleMapsApi.getCoordinates(msgContent);
	let data = await darkSkyApi.getFormattedForecast(coord.lat + "," + coord.lng, coord.formattedAddress);
	msg.reply(
	  data
	);
  }
  else if (msgContent.includes('!coord')) {
    msg.reply(
	  await googleMapsApi.getFormattedCoordinates(msgContent)
	);
  }
  else if (msgContent === '!dbd shrine') {
	msg.reply(
	  await dbdApi.getShrine()
	);
  } else if (msgContent.match(regex) != null){
	  console.log(msg);
	msg.reply(msg.id);
  }

  // Save the list after each command
  listSaver.saveListsToJson(houseList);
 });
 
 client.on('ready', function() {
  try {
    const lastData = require('./liveData.json');
    houseList = listSaver.loadData(lastData);
  }catch(err){
      console.log('No previous data available. Will create a new file');
  }

  try {
   setInterval(()=>{
     listSaver.saveListsToJson(houseList, true);
   }, 3600000)
  }catch(err){
   console.log('The hourly back up save failed.');
  }
 });

client.login(auth.token);