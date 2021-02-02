const https = require('https');
const fetch = require("node-fetch");
const auth = require("../../auth.json");

module.exports = class TwinWordApi {
  constructor() {
	  this.apiHostname = "";
	  this.endpoint = "";
		this.method = "GET";

		this.apiKey = "";
		this.headers = {
			'x-rapidapi-key': this.apiKey,
			"x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
			"useQueryString": "true"
		};
	}

	updateHeader() {
		this.headers = {
			'x-rapidapi-key': this.apiKey,
			"x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
			"useQueryString": "true"
		};
	}

	updateApiKeyAndHeader(apiKey) {
		this.apiKey = apiKey;
		this.updateHeader();
  }
  
	async getDefinition(inputString) {
		this.updateApiKeyAndHeader(
			auth.apiKeys.twinWord.dictionary // 10,000 requests/month free
		);
		
		try {
			let uri = "https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=" + inputString;
			console.log("url", uri);
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

	async getSentimentAnalysis(inputString) {
		this.updateApiKeyAndHeader(
			auth.apiKeys.twinWord.sentimentAnalysis // 500 requests/month free
		);

		this.headers = {
			'x-rapidapi-key': auth.apiKeys.twinWord.sentimentAnalysis,
			"x-rapidapi-host": "twinword-sentiment-analysis.p.rapidapi.com",
			"useQueryString": "true"
		};
		
		try {
			let uri = "https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=" + inputString;
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