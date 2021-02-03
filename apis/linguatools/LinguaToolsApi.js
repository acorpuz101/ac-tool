const https = require('https');
const fetch = require("node-fetch");
const auth = require("../../auth.json");

module.exports = class LinguaToolsApi {
  constructor() {
		this.apiHostname = "";
		this.method = "GET";

		this.apiKey = "";
		this.headers = {
			'x-rapidapi-key': auth.apiKeys.linguaTools,
			"x-rapidapi-host": "petapro-translate-v1.p.rapidapi.com",
			"useQueryString": "true"
		};
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