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
		const playerWins = player.Wins;
		const playerLosses = player.Losses;

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

		console.log(motdJson);
		const motd = motdJson[0];

		let str = "```\nSmite MOTD\n\n" +
			motd.name + "\n" +
			"Max Players: " + motd.maxPlayers + "\n" +
			"Description: " + motd.description.replace(/<li>/g, "\n\t").replace(/<\/li>/g, "") + "\n" +
			"```";
		return str;
    }

	// TODO: Parse
	async getMatchHistoryByPlayerName(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");

		const matchHistory = await this.hiRezSession.getMatchHistory(playerName);
		return matchHistory;
	}

	// TODO: Parse
	async getGodRanks(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");

		const godRanks = await this.hiRezSession.getGodRanks(playerName);
		return godRanks;
	}

	async getGodKdr(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");

		const godRanks = await this.hiRezSession.getGodRanks(playerName);

		let str = "```\n" + "God".padEnd("12", " ") + "\tKDA".padEnd("12", " ") + "\tWins/Lossses\n";

		const dataLength = 10;
		for (let i = 0; i < dataLength; i++) {
			const godData = godRanks[i];
			const kda = godData.Kills.toString() + "/" + godData.Deaths.toString() + "/" + godData.Assists.toString();
			const wl = godData.Wins.toString() + " : " + godData.Losses.toString();
			str += godData.god.padEnd("12", " ") + "\t" + kda.padEnd("12", " ") + "\t" + wl + "\n";
        }
		str += "```"

		return str;
    }

	async getKdrAcrossAllGods(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");

		const godRanks = await this.hiRezSession.getGodRanks(playerName);

		let godKill = 0;
		let godDeath = 0;
		let godAssist = 0;
		let godWin = 0;
		let godLosses = 0;
		for (let i = 0; i < godRanks.length; i++) {
			let god = godRanks[i];
			godKill += god.Kills;
			godDeath += god.Deaths;
			godAssist += god.Assists;
			godWin += god.Wins;
			godLosses += god.Losses;
		}

		let kdar = (godKill + godAssist) / godDeath;
		let kdr = (godKill / godDeath);
		let wl = (godWin / godLosses);

		const kda = "```\n" + playerName + "\n\nK / D / A\n"
			+ godKill.toString() + " / " + godDeath.toString() + " / " + godAssist.toString() + "\n\n"
			+ "K/D: " + kdr.toFixed(2).toString() + "\n"
			+ "K/D/A: " + kdar.toFixed(2).toString() + "\n\n"
			+ "Wins / Losses\n" + godWin.toString() + " / " + godLosses.toString() + "\n\n"
			+ "W/L: " + wl.toFixed(2).toString() + "\n"
			+ "```";

		return kda;
	}

	async getPlayerAccount(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");
		const info = await this.hiRezSession.getPlayerIdByName(playerName);

		let str = "```\n" + playerName + "\n" +
			"Player Id: " + info[0].player_id + "\n" +
			"Portal: " + info[0].portal + "\n" +
			"isPrivate: " + info[0].privacy_flag + "\n" +
			"```";
		return str;
	}
}