/**
 * This class will handle the transformation of data into content 
 * for the discord bot.
 * 
 * I.E. how the data is presented by the discord bot by either a text message,
 * Embed, etc.
 * 
 * TODO: The older methods will be eventually refactored into this class or a similar structure.
 * */

const Discord = require('discord.js');

module.exports = class DiscordWriter {
  constructor() {

  }

	presentDefinition(defData) {
		if (defData.result_code == "200") {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#008061')
				.setTitle(`${defData.response}`)
				.setDescription(`IPA: ${defData.ipa}`)
				.setTimestamp()
				.setFooter(`${defData.author} | Word Dictionary API v${defData.version}`);

			if (defData.meaning.noun != "") exampleEmbed.addFields({name: "noun", value: defData.meaning.noun})
			if (defData.meaning.verb != "") exampleEmbed.addFields({ name: "verb", value: defData.meaning.verb})
			if (defData.meaning.adverb != "") exampleEmbed.addFields({ name: "adverb", value: defData.meaning.adverb})
			if (defData.meaning.adjective != "") exampleEmbed.addFields({ name: "adjective", value: defData.meaning.adjective})

			return exampleEmbed;
		} else {
			return `Result Code: ${defData.result_code} \n ${defData.result_msg}`;
		}
	}

	presentSentimentAnalysis(saData, phrase) {
		if (saData.result_code == "200") {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#008061')
				.setTitle(`${saData.type} - Score: ${saData.score}`)
				.setDescription(`${phrase.replace(/[+]/g, " ")}`)
				.setTimestamp()
				.setFooter(`${saData.author} | Sentiment Analysis API v${saData.version}`);

			for (let i = 0; i < saData.keywords.length; i++) {
				exampleEmbed.addFields({ name: `${saData.keywords[i].word}`, value: `Score: ${saData.keywords[i].score}` });
      }

			return exampleEmbed;
		} else {
			return `Result Code: ${saData.result_code} \n ${saData.result_msg}`;
		}
	}

	presentArticleSummary(summaryData, uri) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#008061')
			.setTitle(`Article Summary`)
			.addFields(
				{ name: "Input", value: `${uri}` },
				{ name: "Original Word Count", value: `${summaryData.text.replace("\n", " ").length}` }
			)
			.setTimestamp()
			.setFooter(`Aylien Text Analysis API`);

		let description = "";

		for (let i = 0; i < summaryData.sentences.length; i++) {
			let sentence = summaryData.sentences[i];
			let suffixTxt = (sentence.includes("\n")) ? "\n" : "\n\n";
			description += sentence + suffixTxt;
		}
		exampleEmbed.setDescription(description);

		return exampleEmbed;
	}

	presentAylienSentimentAnalysis(data) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#008061')
			.setTitle(`Sentiment Analysis`)
			.addFields(
				{ name: "Polarity", value: `${data.polarity}` },
				{ name: "Polarity Confidence", value: `${data.polarity_confidence}` },
				{ name: "Subjectivity", value: `${data.subjectivity}` },
				{ name: "Subjective Confidence", value: `${data.subjectivity_confidence}` },
				{ name: "Text Analyzed", value: `${data.text}` }
			)
			.setTimestamp()
			.setFooter(`Aylien Text Analysis API`);

		return exampleEmbed;
  }

	presentHashtagSuggestion(data) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#008061')
			.setTitle(`Sentiment Analysis`)
			.addFields(
				{ name: "Text Analyzed", value: `${data.text}` },
				{ name: "Language", value: `${data.language}` }
			)
			.setTimestamp()
			.setFooter(`Aylien Text Analysis API`);

		let hashtags = "";
		for (let i = 0; i < data.hashtags.length; i++) {
			hashtags += data.hashtags[i] + "\n";
		}

		exampleEmbed.addFields(
			{ name: "Hashtag Suggestion", value: `${hashtags}` }
		)

		return exampleEmbed;
  }

	presentLanguageDetection(data) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#008061')
			.setTitle(`Language Detection`)
			.addFields(
				{ name: "Input Text", value: `${data.text}` },
				{ name: "Language", value: `${data.language}` },
				{ name: "Confidence", value: `${data.confidence}` }
			)
			.setTimestamp()
			.setFooter(`Aylien Text Analysis API`);

		return exampleEmbed;
  }
}