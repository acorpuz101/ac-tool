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
const moment = require("moment");

module.exports = class FileWriter {
  constructor() {
    this.targetDir = path.join(__dirname, "generatedFiles");
    this.articleTemplate = path.join(__dirname, "templates", "templateArticle.html");
  }

  async getTemplateData() {
    const data = await fsp.readFile(this.articleTemplate, 'binary');
    return new Buffer(data).toString();
  }

  checkDirToMake(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  async createFileForArticle(data) {
    const articleTitle = data.title;
    const articleAuthor = data.author;

    const nameOfFile = `${moment().format("HH-mm-ss")}-${articleTitle.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(" ").slice(0,5).join("_")}.html`;
    const filePath = path.join(this.targetDir, nameOfFile);

    const templateData = await this.getTemplateData();
    let articleData = templateData.replace(/REPLACE_BODY/, "<p>" + data.article.replace(/(\n\n)/gim, "</p><p>"));
    articleData = articleData.replace(/REPLACE_TITLE/, articleTitle);
    articleData = articleData.replace(/REPLACE_AUTHOR/, articleAuthor);
    articleData = articleData.replace(/REPLACE_PUBLISH_DATE/, data.publishDate);

    this.checkDirToMake(this.targetDir);

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