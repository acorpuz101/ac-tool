const https = require('https');
const fetch = require("node-fetch");
const crypto = require('crypto');
const moment = require('moment');
const config = require("../../config.json");

module.exports = class Session {
	constructor() {
		this.devId = config.apiKeys.smite.devId;
		this.authKey = config.apiKeys.smite.authKey;
		this.session = null;
	}

	async fetchMethod(methodName) {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}`);
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

	async getPlayerIdByName(playerName, methodName = "getplayeridbyname") {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerName}`);
		const resJson = res.json();
		return resJson;
	}

	async getPlayerInfo(playerName, methodName = "getplayer") {
		const player = await this.getPlayerIdByName(playerName);
		const playerId = player[0].player_id;
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerId}`);
		const resJson = res.json();
		return resJson;
    }

	async getMotd(methodName = "getmotd") {
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}`);
		const resJson = res.json();
		return resJson;
    }

	async getMatchHistory(playerName, methodName = "getmatchhistory") {
		const player = await this.getPlayerIdByName(playerName);
		const playerId = player[0].player_id;
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerId}`);
		const resJson = res.json();
		return resJson;
	}

	async getGodRanks(playerName, methodName = "getgodranks") {
		const player = await this.getPlayerIdByName(playerName);
		const playerId = player[0].player_id;
		const { signature, timestamp } = await this.createHirezSig(this.devId, methodName, this.authKey);
		const res = await fetch(`http://api.smitegame.com/smiteapi.svc/${methodName}Json/${this.devId}/${signature}/${this.session ? `${this.session}/` : ''}${timestamp}/${playerId}`);
		const resJson = res.json();
		return resJson;
	}

}