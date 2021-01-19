// Import dependencies
const Discord = require('discord.js');

// Import App Functions
const HouseList = require('./house-fn/house-list');
const SaveAppData = require('./house-fn/SaveAppData');
const CommonUtils = require('./house-fn/CommonUtils');
const BotResponse = require('./BotResponse');


// Import Config Files
const auth = require('./auth.json');

// Initialize Variables
const client = new Discord.Client();
const botResponse = new BotResponse();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    botResponse.routeMessage(msg);
 });
 
 client.on('ready', function() {

 });

client.login(auth.token);