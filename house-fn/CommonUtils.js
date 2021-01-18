module.exports = class CommonUtils {
  constructor() {
  }

  cleanInput(cmd, fullCmd) {
    let msgString = fullCmd;
    let cleanedInput = msgString.replace(cmd, '');
    cleanedInput.replace(cmd, '');
    cleanedInput.trim();
    return cleanedInput;
  }

  validateMoveInput(list, index) {
    if(list == undefined) return false;
    let doesIndexExist = (list[index] == undefined) ? false : true;
    return doesIndexExist;
  }

  checkIfUserIsAuthorized(listOfAuthorizedUserIds, authorId) {
    return (listOfAuthorizedUserIds.includes(authorId.toString())) ? true : false;
  }

}