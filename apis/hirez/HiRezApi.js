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

}