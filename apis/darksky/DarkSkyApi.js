const https = require('https');
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports = class DarkSkyApi {
  constructor() {
	  this.apiHostname = "https://api.darksky.net/forecast/";
	  this.endpoint = "";
	  this.method = "GET";
	  this.headers = { 'Content-Type': 'application/json'};
  }
  
  async getForecast(latLongStr) {
	  console.log('lls', latLongStr);
	  let uri = this.apiHostname + config.apiKeys.darkSky + "/" + latLongStr;
	  console.log(uri);
	  try {
		  const response = await fetch(uri, {
			  method: this.method,
			  headers: this.headers
		  });
		  const data = await response.json();
		  console.log('data', data);
		  return data;
	  } catch (e) {
		  console.log('map err', e);
		  return e;
	}
  }
  
  async getFormattedForecast(latLongStr, formattedAddress) {
	const getForecastJson = await this.getForecast(latLongStr);
	let str = "```ini\n" +
	  formattedAddress + "\n" +
	  new Date (getForecastJson.currently.time * 1000) + "\n" +
	  "[Summary] " + getForecastJson.currently.summary + "\n" +
	  "[Currently] " + getForecastJson.currently.temperature + " F\n" +
	  "[Feels Like] " + getForecastJson.currently.apparentTemperature + " F\n" +
	  "[Precip %] " + getForecastJson.currently.precipProbability + "\n" +
	  "[Humidity] " + getForecastJson.currently.humidity + "\n" +
	  "[Wind Speed] " + getForecastJson.currently.windSpeed + "\n" +
	  "```";
	  console.log(str);
	return str;
  }

}