/**
 * This class will handle the transformation of data into content 
 * for the discord bot.
 * 
 * I.E. how the data is presented by the discord bot by either a text message,
 * Embed, etc.
 * 
 * TODO: The older methods will be eventually refactored into this class or a similar structure.
 * */

const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

module.exports = class FileWriter {
  constructor() {
    this.targetDir = path.join(__dirname, "generatedFiles");
    this.articleTemplate = path.join(__dirname, "generatedFiles", "templateArticle.html");
  }

  async getTemplateData() {
    const data = await fsp.readFile(this.articleTemplate, 'binary');
    return new Buffer(data).toString();
  }

  async createFileForArticle(data) {
    const nameOfFile = "testArticle.html";
    const filePath = path.join(this.targetDir, nameOfFile);

    const templateData = await this.getTemplateData();
    let articleData = templateData.replace(/REPLACE_BODY/, "<p>" + data.article.replace(/(\n\n)/gim, "</p><p>"));
    articleData = articleData.replace(/REPLACE_TITLE/, data.title);
    articleData = articleData.replace(/REPLACE_AUTHOR/, data.author);
    articleData = articleData.replace(/REPLACE_PUBLISH_DATE/, data.publishDate);

    await fs.writeFile(
      filePath,
      articleData,
      (err) => {
        console.log("err", err);
      }
    );
    return filePath;
  }
}