const https = require('https');
const fetch = require("node-fetch");
const Discord = require('discord.js');

module.exports = class DbdApi {
  constructor() {
	  this.apiHostname = "https://dbd-stats.info";
	  this.endpoint = "";
	  this.method = "POST";
	  this.headers = { 'Content-Type': 'application/json'};
  }
  
  async getDbdApiRequest() {
	  try {
		  const response = await fetch(this.apiHostname + this.endpoint, {
			  method: this.method,
			  headers: this.headers
		  });
		  return await response.json();
	  } catch (e) {
		  return e;
	}
  }

  async getShrine(cmd, fullCmd) {
		this.endpoint = "/api/shrineofsecrets";
		const data = await this.getDbdApiRequest();
		const perkData = await this.getPerks();
		return this.createShrineEmbed(data, perkData);
	}

	async getPerks() {
		this.endpoint = "/api/perks";
		const data = await this.getDbdApiRequest();
		return data;
  }

	// TODO: Add data for perk variables
	cleanPerkDescriptions(rawPerkDescription) {

		// Replace BR with \n for the new lines
		let description = rawPerkDescription.replace("<br>", "\n");

		// Replace HTML tags with nothing
		description = description.replace(/(<([^>]+)>)/gi, "");

		// Replace starting quotes with a new line
		description = description.replace(" \"", "\n\"");
		return description;
  }

	createShrineEmbed(shrineData, perkData) {

		const date = new Date(shrineData.endDate);
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#008061')
			.setTitle("Today's Shrine")
			.setDescription("Ends: " + date.toLocaleDateString() + " " + date.toLocaleTimeString("en-US", { timeZone: "America/Chicago" }) + " CST\n")
			.addFields(
				{ name: shrineData.items[0].Name, value: "\t" + this.cleanPerkDescriptions(perkData[shrineData.items[0].id].perkDefaultDescription) },
				{ name: shrineData.items[1].Name, value: "\t" + this.cleanPerkDescriptions(perkData[shrineData.items[1].id].perkDefaultDescription) },
				{ name: shrineData.items[2].Name, value: "\t" + this.cleanPerkDescriptions(perkData[shrineData.items[2].id].perkDefaultDescription) },
				{ name: shrineData.items[3].Name, value: "\t" + this.cleanPerkDescriptions(perkData[shrineData.items[3].id].perkDefaultDescription) },
			)
			.setTimestamp();

		return exampleEmbed;
	}

}