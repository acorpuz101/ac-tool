const https = require('https');
const fetch = require("node-fetch");
const crypto = require('crypto');
const moment = require('moment');
const config = require("../../config.json");

module.exports = class BaseApiCommands {
	constructor() {
		this.devId = config.apiKeys.smite.devId;
		this.authKey = config.apiKeys.smite.authKey;
		this.session = null;
		this.privateProfileResult = { "isPrivate": true };
	}

	async fetchMethod(methodName) {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}`);
		const resJson = await res.json();
		return resJson;
	}

	async fetchMethodWithPlayerId(methodName, playerId) {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerId}`);
		const resJson = await res.json();
		return resJson;
	}

	async fetchMethodWithMatchId(methodName, matchId) {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${matchId}`);
		const resJson = await res.json();
		return resJson;
	}

	createHirezSig(devId, methodName, authKey, timestamp) {
		return new Promise((resolve, reject) => {
			if (!timestamp) timestamp = this.createTimestamp();
			const hash = crypto.createHash('md5');
			hash.on('error', reject);
			hash.on('readable', () => {
				const data = hash.read();
				if (!data) return reject(new Error('No hash data'));
				return resolve({ signature: data.toString('hex'), timestamp });
			});
			hash.write(`${devId}${methodName.toLowerCase()}${authKey}${timestamp}`);
			hash.end();
		})
	}

	createTimestamp() {
		return moment().utc().format('YYYYMMDDHHmmss');
	}

	async createSession() {
		const session = await this.getSession();
		if (session.ret_msg.toLowerCase() == "approved") {
			console.log("Session SUCCESS", session.session_id);
			this.session = session.session_id;
		} else {
			console.log("Session FAILED");
        }
	}

	async getSession() {
		const session = await this.fetchMethod('createsession');
		return session;
	}

	async isProfilePrivate(playerName) {
		const player = await this.getPlayerIdByName(playerName);
		return {
			"isPrivate": (player[0].privacy_flag == "y") ? true : false,
			"playerId": player[0].player_id
		}
    }

	async getPlayerIdByName(playerName, methodName = "getplayeridbyname") {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerName}`);
		const resJson = res.json();
		return resJson;
	}

	async getPlayerInfo(playerName, methodName = "getplayer") {
		let playerInfo = await this.isProfilePrivate(playerName);
		if (playerInfo.isPrivate) return this.privateProfileResult;
		const playerId = playerInfo.playerId;
		return await this.fetchMethodWithPlayerId(methodName, playerId);
    }

	async getMotd(methodName = "getmotd") {
		return await this.fetchMethod(methodName);
    }

	async getMatchHistory(playerName, methodName = "getmatchhistory") {
		let playerInfo = await this.isProfilePrivate(playerName)
		if (playerInfo.isPrivate) return this.privateProfileResult;
		const playerId = playerInfo.playerId;
		return await this.fetchMethodWithPlayerId(methodName, playerId);
	}

	async getGodRanks(playerName, methodName = "getgodranks") {
		let playerInfo = await this.isProfilePrivate(playerName)
		if (playerInfo.isPrivate) return this.privateProfileResult;
		const playerId = playerInfo.playerId;
		return await this.fetchMethodWithPlayerId(methodName, playerId);
	}

	async getPlayerStatus(playerName, methodName = "getplayerstatus") {
		const player = await this.getPlayerIdByName(playerName);
		if (await this.isProfilePrivate(playerName)) return this.privateProfileResult;
		const playerId = player[0].player_id;
		return await this.fetchMethodWithPlayerId(methodName, playerId);
	}

	async getMatchByMatchId(matchId, methodName = "getmatchdetails") {
		return await this.fetchMethodWithMatchId(methodName, matchId);

	}

	async getMatchPlayerDetailsByMatchId(matchId, methodName = "getmatchplayerdetails") {
		return await this.fetchMethodWithMatchId(methodName, matchId);
	}

}