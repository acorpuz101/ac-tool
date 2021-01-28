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
		const data = await this.baseApiCmds.validateSession();
		console.log("session-check", data);
		if (data.toLowerCase().includes("invalid session id")) {
			this.baseApiCmds.setSessionToNull();
			console.log("Invalid HiRez Session. Creating new session.");
			await this.baseApiCmds.createSession();
		}
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
		return this.uiWriter.getPlayerInfo(playerInfo);
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
		return this.uiWriter.getMotd(motdJson);
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
		let playerStatus = await this.baseApiCmds.getPlayerStatus(playerName);
		console.log("gps-playerSTatus", playerStatus);

		return playerStatus;
	}

	// Works, needs more data
	async getMatchStatus(inputString) {

		let playerName = this.parsePlayerName(inputString);
		let playerStatus = await this.baseApiCmds.getPlayerStatus(playerName);
		if (playerStatus.isPrivate == true) return this.uiWriter.generatePrivateString(playerName);

		const matchId = playerStatus[0].Match;
		const info = await this.baseApiCmds.getMatchPlayerDetailsByMatchId(matchId);

		// get each player's individual stats
		// init empty object
		let eachPlayerInfo = {};

		// add each player to the obj
		// key: playerName, value: playerInfo
		for (let i = 0; i < info.length; i++) {

			let playerInfo;
			const iPlayerName = info[i].playerName;
			eachPlayerInfo[iPlayerName] = "";

			if (iPlayerName == "") continue;
			
			try {
				playerInfo = await this.baseApiCmds.getPlayerInfo(iPlayerName); // TODO: Changes this to GodRanks then use that data
			} catch (e) {
				console.log('error', i, info[i]);
				console.log(e);
				continue;
			}

			if (playerInfo.isPrivate) continue;

			eachPlayerInfo[iPlayerName] = playerInfo[0];
		}

		console.log('gms', eachPlayerInfo);

		let string = await this.uiWriter.getMatchStatus(info, playerName, eachPlayerInfo);

		return string;
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