const https = require('https');
const fetch = require("node-fetch");
const config = require("../../config.json");
const HiRezSession = require("./Session");

module.exports = class HiRezApi {
  constructor() {
	  this.devId = config.apiKeys.smite.devId;
	  this.authKey = config.apiKeys.smite.authKey;
	  this.hiRezSession = new HiRezSession();
  }

	async createSession() {
		return await this.hiRezSession.createSession();
	}

	createTimestamp() {
		return this.hiRezSession.createTimestamp();
	}

	async getPlayerInfo(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");

		const playerInfo = await this.hiRezSession.getPlayerInfo(playerName);
		const player = playerInfo[0];
		let str = "```\n" + player.hz_player_name + " - " + player.Team_Name + " - " + player.Region + "\n\n" +
			"Stats:\n" + "\t" + "Wins:".padEnd("15", " ") + player.Wins + "\n\t" + "Losses:".padEnd("15", " ") + player.Losses + "\n\t" +
			"\n\t" + "Player Lvl:".padEnd("15", " ") + player.Level +
			"\n\t" + "Mastery Lvl:".padEnd("15", " ") + player.MasteryLevel +
			"\n\t" + "Hours Played:".padEnd("15", " ") + player.HoursPlayed +
			"```";
			
		console.log(playerName, playerInfo);
		return str;
    }

	async getPlayerIdByName(name) {
		const playerIds = await this.hiRezSession.getPlayerIdByName(name, 'getplayeridbyname');
		console.log(name, playerIds);
    }

	async getServerStatus() {
		return await this.hiRezSession.fetchMethod('gethirezserverstatus');
	}

	async statusOfServer() {
		const serverStatus = await this.getServerStatus();
		let str = "```\nSmite Server Status\n";
		for (let i = 0; i < serverStatus.length; i++) {
			str +=
				serverStatus[i].platform.padEnd("8", " ") + "\t" + serverStatus[i].status.padEnd("8", " ") + "\t" + serverStatus[i].entry_datetime + "\n";
		}
		str += "```";
		return str;
	}

	async getMotd() {
		const motdJson = await this.hiRezSession.getMotd();
		const motd = motdJson[0];

		let str = "```\nSmite MOTD\n" +
			motd.name + "\n" +
			"Max Players: " + motd.name + "\n" +
			"Description: " + motd.description.replace(/<li>/g, "\n\t").replace(/<\/li>/g, "") + "\n" +
			"```";
		return str;
    }

}