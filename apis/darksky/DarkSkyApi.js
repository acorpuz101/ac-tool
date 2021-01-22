const https = require('https');
const fetch = require("node-fetch");
const config = require("../../config.json");
const dateFormat = require('dateformat');

module.exports = class DarkSkyApi {
  constructor() {
	  this.apiHostname = "https://api.darksky.net/forecast/";
	  this.endpoint = "";
	  this.method = "GET";
	  this.apiKey = config.apiKeys.darkSky;
	  this.headers = { 'Content-Type': 'application/json' };
	  this.cstOffset = 6;
  }
  
  async getForecast(latLongStr) {
	  let uri = this.apiHostname + this.apiKey + "/" + latLongStr;
	  try {
		  const response = await fetch(uri, {
			  method: this.method,
			  headers: this.headers
			}
		  );
		  const data = await response.json();
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
		new Date(getForecastJson.currently.time * 1000) + "\n" +
		"[Summary]".padEnd("12", ' ') + getForecastJson.currently.summary + "\n" +
		"[Currently]".padEnd("12", ' ') + getForecastJson.currently.temperature + " F\n" +
		"[Feels Like]".padEnd("12", ' ') + getForecastJson.currently.apparentTemperature + " F\n" +
		"[High/Low]".padEnd("12", ' ') + getForecastJson.daily.data[0].temperatureHigh + "F / " + getForecastJson.daily.data[0].temperatureLow + " F\n" +
		"[Precip %]".padEnd("12", ' ') + getForecastJson.currently.precipProbability + "\n" +
		"[Humidity]".padEnd("12", ' ') + getForecastJson.currently.humidity + "\n" +
		"[Wind Speed]".padEnd("12", ' ') + getForecastJson.currently.windSpeed + "\n" +
	  "```";
	return str;
  }

	async getHourlyForecast(latLongStr, formattedAddress) {
	  const getForecastJson = await this.getForecast(latLongStr);
		let str = "```ini\n" + formattedAddress + "\n";
		str += "\tDate Time\t\tTemp\t\t\tPrecip%\tHumidity\tWindSpd\t\tSummary\n";
		const hourlyData = getForecastJson.hourly.data;
		if (hourlyData) {
			for (let i = 0; i < 12; i++) {
				str += dateFormat(new Date((hourlyData[i].time * 1000) - ((1 * 60 * 60 * 1000) * this.cstOffset)), "mm/dd/yy HH:MM").padEnd("15", ' ') + 
					"CST\t\t" + hourlyData[i].temperature.toFixed(2) + " F \t\t" + (hourlyData[i].precipProbability.toFixed(2) * 100) +
					"%\t\t" + (hourlyData[i].humidity.toFixed(2) * 100) + "%\t\t" + hourlyData[i].windSpeed.toFixed(2) +
					"\t\t" + hourlyData[i].summary.trim() +"\n";
			}
			str += "```";
			return str;
        }
    }

	async getEightDayForecast(latLongStr, formattedAddress) {
		const getForecastJson = await this.getForecast(latLongStr);
		let str = "```ini\n" + formattedAddress + "\n";
		str += "\tDateTime\t\tHigh / Low\t\t\tPrecip%\tHumidity\tWindSpd\t\tSummary\n";
		const dailyData = getForecastJson.daily.data;
		if (dailyData) {
			for (let i = 0; i < dailyData.length; i++) {
				str += dateFormat(new Date(dailyData[i].time * 1000), "ddd mm/dd/yy") +
					"\t\t" + dailyData[i].temperatureHigh.toFixed(2) + "F / " + dailyData[i].temperatureLow.toFixed(2) + "F" +
					"\t\t" + dailyData[i].precipProbability.toFixed(2) + "%" +
					"\t\t" + dailyData[i].humidity.toFixed(2) + "%\t\t" + dailyData[i].windSpeed.toFixed(2) +
					"\t\t" + dailyData[i].summary.trim() + "\n";
			}
			str += "```";

			return str;
		}
	}
}
