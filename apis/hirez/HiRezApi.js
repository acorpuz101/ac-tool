const https = require('https');
const fetch = require("node-fetch");
const auth = require("../../auth.json");
const BaseApiCommands = require("./BaseApiCommands");
const UiWriter = require("./UiWriter");

module.exports = class HiRezApi {
  constructor() {
	  this.devId = auth.apiKeys.smite.devId;
	  this.authKey = auth.apiKeys.smite.authKey;
	  this.baseApiCmds = new BaseApiCommands();
	  this.uiWriter = new UiWriter();
	}

	async checkIfSessionIsValid() {
		return await this.baseApiCmds.validateSession();
    }

	parsePlayerName(inputString) {
		let playerName = inputString.trim().split(" ");
		playerName.shift();
		playerName = playerName.join(" ");
		return playerName;
    }

	async getPlayerInfo(inputString) {
		let playerName = this.parsePlayerName(inputString);
		const playerInfo = await this.baseApiCmds.getPlayerInfo(playerName);
		if (playerInfo.isPrivate) return this.uiWriter.generatePrivateString(playerName);
		return this.uiWriter.getPlayerInfo(playerInfo[0]);
    }

	async getPlayerIdByName(name) {
		const playerIds = await this.baseApiCmds.getPlayerIdByName(name, 'getplayeridbyname');
		console.log(name, playerIds);
    }

	async statusOfServer() {
		const serverStatus = await this.baseApiCmds.getServerStatus();
		return this.uiWriter.statusOfServer(serverStatus);
	}

	async getMotd() {
		const motdJson = await this.baseApiCmds.getMotd();
		return this.uiWriter.getMotd(motdJson[0]);
	}

	async getGodKdr(inputString) {
		let playerName = this.parsePlayerName(inputString);
		const godRanks = await this.baseApiCmds.getGodRanks(playerName);
		return this.uiWriter.getGodKdr(playerName, godRanks);
    }

	async getKdrAcrossAllGods(inputString) {
		let playerName = this.parsePlayerName(inputString);
		const godRanks = await this.baseApiCmds.getGodRanks(playerName);
		return this.uiWriter.getKdrAcrossAllGods(playerName, godRanks);
	}

	async getPlayerAccount(inputString) {
		let playerName = this.parsePlayerName(inputString);
		const info = await this.baseApiCmds.getPlayerIdByName(playerName);
		return this.uiWriter.getPlayerAccount(playerName, info);
	}

	async getPlayerStatus(inputString) {
		let playerName = this.parsePlayerName(inputString);
		const info = await this.baseApiCmds.getPlayerStatus(playerName);

		console.log(info);
		return info;
	}

	// TODO: Add player details. Check private status; might break.
	// Move UI code to UiWriter
	async getMatchStatus(inputString) {
		const info = await this.baseApiCmds.getMatchPlayerDetailsByMatchId(inputString);

		let str = "```\n" + "Current Match Status for " + inputString + "\n\n";
		str += "  GodName".padEnd("15", " ") + "\t" + "  PlayerName".padEnd("15", " ") + "\t\n";
		for (let i = 0; i < info.length; i++) {
			let player = info[i];

			// const godRank = await this.hiRezSession.getGodRanks(player);
			// const isPrivate = (godRankInfo)

			str += player.GodName.padEnd("15", " ") + "\t" + player.playerName.padEnd("15", " ") + "\t\n";
		}
		str += "```";

		return str;
	}

	// TODO: Create UiWriter for this data
	async getMatchHistoryByPlayerName(inputString) {
		let playerName = this.parsePlayerName(inputString);

		const matchHistory = await this.baseApiCmds.getMatchHistory(playerName);
		return matchHistory;
	}

	// TODO: Create UiWriter for this data
	async getGodRanks(inputString) {
		let playerName = this.parsePlayerName(inputString);

		const godRanks = await this.baseApiCmds.getGodRanks(playerName);
		return godRanks;
	}
}