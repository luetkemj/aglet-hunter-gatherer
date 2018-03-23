const fs = require('fs');
const _ = require('lodash');

const data = require('./data.json');

const climates = [
  'tropical',
  'subtropical',
  'temperate',
  'subarctic',
  'arctic',
];

const terrains = [
  'hills',
  'mountains',
  'forest',
  'plains',
  'swamp',
  'desert',
  'coast',
];

const articTerrains = [
  'hills',
  'mountains',
  'plains',
  'desert',
  'coast',
];

const chunked = _.chunk(data, 7);

buildTables = (data) => {
  const forage = data[0].split('/');
  const hunt = data[1];

  return {
    forage: {
      success: forage[0],
      quality: forage[1],
    },
    hunt: {
      success: hunt,
    },
  }
}

markSeasons = (data) => {
  const tables = data.split(' ');
  const tablesBySeason = _.chunk(tables, 2);
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  return tablesBySeason.reduce((acc, val, i) => {
    return Object.assign({}, acc, {
      [seasons[i]]: buildTables(tablesBySeason[i]) // ex "spring": [ "30/18", "15", ],
    });
  }, {});
}

assignTerrains = (data) => {
  return data.reduce((acc, val, i) => {
    return Object.assign({}, acc, {
      [terrains[i]]: markSeasons(val), // ex { hills: "2/15 2 3/15 3 2/15 2 1/50 1" }
    })
  }, {});
}

const obj = chunked.reduce((acc, val, i) => {
  return Object.assign({}, acc, {
    [climates[i]]: assignTerrains(val),
  })
}, {})

const dataToWrite = obj;

fs.writeFile("./src/hg-table.js", JSON.stringify(dataToWrite, null, 2), (e) => {
  console.log("Saving file...");
    if (e) {
        return console.log(e);
    }
    console.log("The file was saved!");
});
