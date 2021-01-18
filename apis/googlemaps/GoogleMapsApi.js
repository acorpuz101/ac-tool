const https = require('https');
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports = class GoogleMapsApi {
  constructor() {
	  this.apiHostname = "";
	  this.endpoint = "";
	  this.method = "POST";
	  this.headers = { 'Content-Type': 'application/json'};
	  this.geocodeHostname = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  }
  
  async getGeocode(inputString) {
	  try {
		  const response = await fetch(this.geocodeHostname + inputString.trim().split(" ").join("+") + "&key=" + config.apiKeys.googleMaps, {
			  method: "GET",
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
  
  async getFormattedCoordinates(inputString) {
	let address = inputString.trim().split(" ");
	address.shift();
	address = address.join(" ");
	console.log(address);
	  
	  
    const data = await this.getGeocode(address);
    if(data.status === 'OK'){
	  console.log(data.results[0].geometry.location);
	  const loc = data.results[0].geometry.location;
	  const formattedAddress = data.results[0].formatted_address;
	  let str = "```\n" + formattedAddress + " (User Input: " + address + ")\nLat: " + loc.lat + "\nLng: " + loc.lng + "\n```";
	  return str;
    }else {
	  return "An error occured. Try again. User input: " + address;
	}
  }
  
  async getCoordinates(inputString) {
	let address = inputString.trim().split(" ");
	address.shift();
	address = address.join(" ");
	console.log(address);
	  
    const data = await this.getGeocode(address);
	
    if(data.status === 'OK'){
	  const formattedAddress = data.results[0].formatted_address;
	  const location = data.results[0].geometry.location;
	  location.formattedAddress = formattedAddress;
	
	  return location;
    }else {
	  return "An error occured. Try again. User input: " + address;
	}
  }

}