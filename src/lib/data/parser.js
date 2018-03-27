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

const chunked = _.chunk(data, 7);

const buildTables = (d) => {
  const forage = d[0].split('/');
  const hunt = d[1];

  return {
    gather: {
      success: forage[0],
      quality: forage[1],
    },
    hunt: {
      success: hunt,
    },
  };
};

const markSeasons = (d) => {
  const tables = d.split(' ');
  const tablesBySeason = _.chunk(tables, 2);
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  return tablesBySeason.reduce((acc, val, i) =>
    Object.assign({}, acc, {
      [seasons[i]]: buildTables(tablesBySeason[i]), // ex 'spring': [ '30/18', '15', ],
    }), {});
};

const assignTerrains = d =>
  d.reduce((acc, val, i) =>
    Object.assign({}, acc, {
      [terrains[i]]: markSeasons(val), // ex { hills: '2/15 2 3/15 3 2/15 2 1/50 1' }
    }), {});

const obj = chunked.reduce((acc, val, i) =>
  Object.assign({}, acc, {
    [climates[i]]: assignTerrains(val),
  }), {});

const dataToWrite = obj;

fs.writeFile('./src/lib/tables/hg-table.js', JSON.stringify(dataToWrite, null, 2), (e) => {
  console.log('Saving file...');
  if (e) {
    return console.log(e);
  }
  return console.log('The file was saved!');
});
