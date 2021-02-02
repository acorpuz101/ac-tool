const https = require('https');
const fetch = require("node-fetch");
const auth = require("../../auth.json");

module.exports = class AylienTextAnalysisApi {
	constructor() {
		this.apiHostname = "";
		this.endpoint = "";
		this.method = "GET";

		this.apiKey = auth.apiKeys.aylien; // 1,000 requests/day
		this.headers = {
			'x-rapidapi-key': this.apiKey,
			"x-rapidapi-host": "aylien-text.p.rapidapi.com",
			"useQueryString": "true"
		};
	}

	async extractArticle(articleUri) {

		try {
			let uri = "https://aylien-text.p.rapidapi.com/extract?url=" + articleUri;
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

	async summarizeArticle(articleUri) {
		
		try {
			let uri = "https://aylien-text.p.rapidapi.com/summarize?url=" + articleUri;
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

	async analyzeSentiment(inputString) {
		try {
			let uri = "https://aylien-text.p.rapidapi.com/sentiment?text=" + inputString;
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

	async suggestHashtags(inputString) {
		try {
			let uri = "https://aylien-text.p.rapidapi.com/hashtags?text=" + inputString;
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