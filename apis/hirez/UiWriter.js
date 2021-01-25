const moment = require("moment-timezone");

module.exports = class HiRezApi {
  constructor() {
  }

	generatePrivateString(playerName) {
		return "Player '" + playerName + "' profile is private"
    }

	createTimestamp() {
		return this.baseApiCmds.createTimestamp();
	}

	async getPlayerInfo(player) {

		const playerWins = player.Wins;
		const playerLosses = player.Losses;

		let str = "```\n" + player.hz_player_name + " - " + player.Team_Name + " - " + player.Region + "\n\n" +
			"Stats:\n" + "\t" + "Wins:".padEnd("15", " ") + player.Wins + "\n\t" + "Losses:".padEnd("15", " ") + player.Losses + "\n\t" +
			"\n\t" + "Player Lvl:".padEnd("15", " ") + player.Level +
			"\n\t" + "Mastery Lvl:".padEnd("15", " ") + player.MasteryLevel +
			"\n\t" + "Hours Played:".padEnd("15", " ") + player.HoursPlayed +
			"```";
			
		return str;
    }

	async statusOfServer(serverStatus) {
		let str = "```\nSmite Server Status\n";
		for (let i = 0; i < serverStatus.length; i++) {
			str +=
				serverStatus[i].platform.padEnd("8", " ") + "\t" + serverStatus[i].status.padEnd("8", " ") + "\t" + serverStatus[i].entry_datetime + "\n";
		}
		str += "```";
		return str;
	}

	async getMotd(motd) {

		let todaysDate = new Date();

		let latestMotd = motd.filter(
			e => {
				var d = new Date(e.startDateTime);
				return (
					d.getMonth() == todaysDate.getMonth() &&
					d.getDate() == todaysDate.getDate());
			}
		)[0];

		let str = "```\nSmite MOTD\t" + moment(new Date(latestMotd.startDateTime)).tz('America/Chicago').format("ddd MM/DD/YY zz") + "\n\n" +
			latestMotd.name + "\n" +
			"Max Players: " + latestMotd.maxPlayers + "\n" +
			"Description: " + latestMotd.description.replace(/<li>/g, "\n\t").replace(/<\/li>/g, "") + "\n" +
			"\n\n" + "Future MOTDs" + "\n";

		let numberOfDaysToList = 4; // HiRez usually only lists 4 days into the future. Adding more days won't break it.
		for (let i = 0; i < numberOfDaysToList + 1; i++) {
			let nextMotd = motd.filter(e => {
				var d = new Date(e.startDateTime);
				return (
					d.getMonth() == todaysDate.getMonth() &&	// Month must match or else it might post last month's motd
					d.getDate() == new Date().getDate() + i);
			})[0];

			// If the listing exists, write it to the string. If not, nothing
			if (nextMotd) {
				let motdDate = moment(new Date(nextMotd.startDateTime));
				str += motdDate.tz('America/Chicago').format("ddd MM/DD").padEnd("10", " ") + "\t" + nextMotd.name + "\n";
			}
        }
			str += "```";
		return str;
    }

	async getGodKdr(playerName, godRanks) {
		if (godRanks.isPrivate) return this.generatePrivateString(playerName);
		let str = "```\n" + "God".padEnd("12", " ") + "\tKDA".padEnd("12", " ") + "\tWins/Lossses\n";

		const dataLength = 10;
		for (let i = 0; i < dataLength; i++) {
			const godData = godRanks[i];
			const kda = godData.Kills.toString() + "/" + godData.Deaths.toString() + "/" + godData.Assists.toString();
			const wl = godData.Wins.toString() + " : " + godData.Losses.toString();
			str += godData.god.padEnd("12", " ") + "\t" + kda.padEnd("12", " ") + "\t" + wl + "\n";
        }
		str += "```"

		return str;
    }

	async getKdrAcrossAllGods(playerName, godRanks) {
		if (godRanks.isPrivate) return this.generatePrivateString(playerName);

		let godKill = 0;
		let godDeath = 0;
		let godAssist = 0;
		let godWin = 0;
		let godLosses = 0;
		for (let i = 0; i < godRanks.length; i++) {
			let god = godRanks[i];
			godKill += god.Kills;
			godDeath += god.Deaths;
			godAssist += god.Assists;
			godWin += god.Wins;
			godLosses += god.Losses;
		}

		let kdar = (godKill + godAssist) / godDeath;
		let kdr = (godKill / godDeath);
		let wl = (godWin / godLosses);

		const kda = "```\n" + playerName + "\n\nK / D / A\n"
			+ godKill.toString() + " / " + godDeath.toString() + " / " + godAssist.toString() + "\n\n"
			+ "K/D: " + kdr.toFixed(2).toString() + "\n"
			+ "K/D/A: " + kdar.toFixed(2).toString() + "\n\n"
			+ "Wins / Losses\n" + godWin.toString() + " / " + godLosses.toString() + "\n\n"
			+ "W/L: " + wl.toFixed(2).toString() + "\n"
			+ "```";

		return kda;
	}

	async getPlayerAccount(playerName, info) {
		let str = "```\n" + playerName + "\n" +
			"Player Id: " + info[0].player_id + "\n" +
			"Portal: " + info[0].portal + "\n" +
			"isPrivate: " + info[0].privacy_flag + "\n" +
			"```";
		return str;
	}

	// TODO: Add player details. Check private status; might break.
	async getMatchStatus(info) {

		let str = "```\n" + "Current Match Status for " + inputString + "\n\n";
		str += "  GodName".padEnd("15", " ") + "\t" + "  PlayerName".padEnd("15", " ") + "\t\n";
		for (let i = 0; i < info.length; i++) {
			let player = info[i];

			// const godRank = await this.hiRezSession.getGodRanks(player);
			// const isPrivate = (godRankInfo)

			str += player.GodName.padEnd("15", " ") + "\t" + player.playerName.padEnd("15", " ") + "\t\n";
		}
		str += "```";

		return str;
	}
}