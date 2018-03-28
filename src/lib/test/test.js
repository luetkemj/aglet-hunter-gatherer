/* eslint-disable no-console */
import _ from 'lodash';
import { gather } from '../index';

const fs = require('fs');

const output = {};

function recordGather(climate, terrain, season, time, pgs, npgs) {
  const path = `${climate}.${terrain}.${season}.${time}.pgs${pgs}.npgs${npgs}`;
  const testResult = { success: 0, quality: 0 };
  _.times(100000, () => {
    const result = gather(climate, terrain, season, pgs, npgs, 'test');
    testResult.success += result.rationsFound;
    testResult.quality += result.qualityRationsFound;
  });

  _.set(output, path, testResult);
  console.log(`test completed: ${path}`);
}

const terrains = [
  'mountains',
  'hills',
  'plains',
  'forest',
  'swamp',
  'desert',
  'coast',
];

const seasons = [
  'spring',
  'summer',
  'fall',
  'winter',
];

const climates = [
  'tropical',
  'subtropical',
  'temperate',
  'subarctic',
  'arctic',
];

_.each(climates, (climate) => {
  _.each(terrains, (terrain) => {
    _.each(seasons, (season) => {
      recordGather(climate, terrain, season, 'day', 1, 0);
      recordGather(climate, terrain, season, 'night', 0, 1);
      recordGather(climate, terrain, season, 'day', 1, 0);
      recordGather(climate, terrain, season, 'night', 0, 1);
    });
  });
});

console.log('Tests Complete! 🎉');

const path = './src/lib/test/test-results.json';
fs.writeFile(path, JSON.stringify(output, null, 2), (e) => {
  console.log('Saving file...');
  if (e) {
    return console.log(e);
  }
  return console.log(`Results saved to file at ${path}`);
});
