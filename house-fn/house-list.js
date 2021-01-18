let ListItem = require('../models/ListItem');
const fs = require('fs');
const CommonUtils = require('./CommonUtils');

module.exports = class HouseList {
  constructor() {
    this.likeList = [];
    this.passList = [];
    this.maybeList = [];
    this.authorizedIds = ['179314473088188417', '181522225835409408'];
    this.MOVE_ERROR_MESSAGE = 'Could not move the listing. The input was incorrect. Check if you gave the correct list or index. \n The proper syntax is:\n ![list-to-move-to] [current-list] [index-of-list]';
    this.MOVE_UNAUTHORIZED = 'Not allowed to move lists. Guests can only add to the maybe list. Convince the homeowners to move it to the like list :D';
    this.commonUtils = new CommonUtils();
  }

  addToList(input, msg) {
    const authorIsAuthorized = this.commonUtils.checkIfUserIsAuthorized(this.authorizedIds, msg.author.id);
    let listItem = new ListItem(input, msg.author.username);
    (authorIsAuthorized) ? this.likeList.push(listItem) : this.maybeList.push(listItem);
    msg.react('👍');
  }

  showList(targetList, msg) {
    let listToShow = undefined;
    if (targetList == 'like') {
      listToShow = this.likeList;
    } else if (targetList == 'pass') {
      listToShow = this.passList;
    } else if (targetList == 'maybe') {
      listToShow = this.maybeList;
    }
    let stringToReturn = '\n' + '**' + targetList.toUpperCase() + ' LIST**' + '\n\t' + '**#**\t' + '**Name**\t' + '**URL**\n';
    listToShow.forEach( (listItem, index) => {
      stringToReturn += '\n\t' + index + '\t' + listItem.name + '\t<' + listItem.url + '>'
    });
    msg.reply(stringToReturn);
  }

  moveItemToList(targetList, input, msg) {
    const authorIsAuthorized = this.commonUtils.checkIfUserIsAuthorized(this.authorizedIds, msg.author.id);

    if(authorIsAuthorized) {
      const moveParams = input.trim().split(' ');
      const oldList = moveParams[0];
      const listInt = moveParams[1];
      let listToMoveFrom = undefined;
      let listToMoveTo = undefined;
      if (targetList == 'like') {
        listToMoveTo = this.likeList;
        if(oldList == 'maybe') listToMoveFrom = this.maybeList;
        if(oldList == 'pass') listToMoveFrom = this.passList;
      } else if (targetList == 'pass') {
        listToMoveTo = this.passList;
        if(oldList == 'like') listToMoveFrom = this.likeList;
        if(oldList == 'maybe') listToMoveFrom = this.maybeList;
      } else if (targetList == 'maybe') {
        listToMoveTo = this.maybeList;
        if(oldList == 'like') listToMoveFrom = this.likeList;
        if(oldList == 'pass') listToMoveFrom = this.passList;
      }
      const doesIndexExist = this.commonUtils.validateMoveInput(listToMoveFrom, listInt);
      if (!doesIndexExist) {
        msg.reply(this.MOVE_ERROR_MESSAGE);
        return;
      }
      listToMoveTo.push(listToMoveFrom[listInt]);
      listToMoveFrom.splice(listInt, 1);
      msg.react('👍');
    } else {
    // TODO
      msg.reply(this.MOVE_UNAUTHORIZED);
    }
  }
}