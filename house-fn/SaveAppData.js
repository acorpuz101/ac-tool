let ListItem = require('../models/ListItem');
const HouseList = require('./house-list');
const fs = require('fs');

module.exports = class SaveAppData {
  constructor() {
  }

  saveListsToJson(houseList, uniqueName = false) {
    let objToSave = {};
    objToSave['likeList'] = houseList.likeList;
    objToSave['passList'] = houseList.passList;
    objToSave['maybeList'] = houseList.maybeList;

    let dataToSave = JSON.stringify(objToSave);

    const now = new Date();
    const nameOfFile = (uniqueName) ? now.toLocaleString() + '.json' : 'liveData.json';
    fs.writeFileSync(nameOfFile, dataToSave);
  }

  loadData(dataJson) {
    let houseListData = new HouseList();
    houseListData.likeList = dataJson['likeList'];
    houseListData.passList = dataJson['passList'];
    houseListData.maybeList = dataJson['maybeList'];
    return houseListData;
  }

}