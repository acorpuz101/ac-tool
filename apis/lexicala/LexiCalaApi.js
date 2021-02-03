const https = require('https');
const fetch = require("node-fetch");
const auth = require("../../auth.json");

module.exports = class LexiCalaApi {
  constructor() {
		this.method = "GET";
		this.apiKey = `${auth.apiKeys.lexiCala.username}:${auth.apiKeys.lexiCala.password}`; //basicAuth
		this.apiHostname = `https://${this.apiKey}@dictapi.lexicala.com`;
	}

	async translateWord(wordToTranslate, langPair) {
		try {
			let uri = `https://petapro-translate-v1.p.rapidapi.com?query=${wordToTranslate}&langpair=${langPair}`;
			console.log("url", uri, this.apiKey);
		  const response = await fetch(uri, {
			  method: "GET",
			  headers: this.headers
		  });
		  return await response.json();
	  } catch (e) {
		  console.log('def err', e);
		  return e;
		}
  }

}