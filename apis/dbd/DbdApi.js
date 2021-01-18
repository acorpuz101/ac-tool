const https = require('https');
const fetch = require("node-fetch");

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
		  const data = await response.json();
		  return data;
	  } catch (e) {
		  return e;
	}
  }

  async getShrine(cmd, fullCmd) {
	this.endpoint = "/api/shrineofsecrets";
	const data = await this.getDbdApiRequest();
	//console.log('dbd', data.items[0].Name);
	let str = "```diff\n"  +
		"Todays's Shine of Secrets\n" +
		"- " + data.items[0].Name + "\n" +
		"- " + data.items[1].Name + "\n" +
		"- " + data.items[2].Name + "\n" +
		"- " + data.items[3].Name + "\n" +
		"Ends: " + data.endDate +
		"```";
	return str;
  }

}