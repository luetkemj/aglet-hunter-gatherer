import _ from 'lodash';
import { game } from './tables/game-table';
import { success } from './tables/success-table';
import { animals } from './tables/animals-table';
import { hg } from './tables/hg-table';

function gatherAttempt(climate, terrain, season, time, proficient, total) {
  let bonus = proficient ? -3 : 3; // lower is better
  if (time === 'night') bonus += 15;
  const results = {
    success: {
      result: undefined,
      roll: _.random(1, 30) + bonus,
      target: hg[climate][terrain][season].gather.success,
    },
    quality: {
      result: undefined,
      roll: _.random(1, 30) + bonus,
      target: hg[climate][terrain][season].gather.quality,
    },
    result: undefined,
  };

  if (results.success.roll <= results.success.target) {
    total.rationsFound += 1; // eslint-disable-line no-param-reassign

    if (results.quality.roll <= results.quality.target) {
      total.qualityRationsFound += 1; // eslint-disable-line no-param-reassign
    }
  }
}

export function gather(climate, terrain, season, time, pgs, npgs, test) {
  const total = {
    rationsFound: 0,
    qualityRationsFound: 0,
  };

  // make proficient attempts and update total
  _.times(pgs, () => gatherAttempt(climate, terrain, season, time, true, total));

  // make non-proficient attempts and update total
  _.times(npgs, () => gatherAttempt(climate, terrain, season, time, false, total));


  let rationsFoundMessage = '';
  if (total.rationsFound > 1) {
    rationsFoundMessage = `You found ${total.rationsFound} days worth of rations.`;
  } else if (total.rationsFound === 1) {
    rationsFoundMessage = 'You found a days worth of rations.';
  } else {
    rationsFoundMessage = "You didn't find anything edible.";
  }

  let rationsQualityMessage = '';
  if (total.qualityRationsFound > 0 && total.rationsFound - total.qualityRationsFound > 0) {
    rationsQualityMessage = `But ${total.rationsFound - total.qualityRationsFound} will make you sick.`;
  }

  if (test) {
    return total;
  }

  return `${rationsFoundMessage} ${rationsQualityMessage}`;
}


function weightedTableRoll(table, roll) {
  const keys = Object.keys(table);
  const key = _.find(keys, k => roll <= k);

  return table[key];
}

export function hunt(climate, terrain, season, time, phs, nphs, verbose) {
  // lower is better
  let timeBonus = 0;
  if (time === 'day') timeBonus += 3;
  if (time === 'night') timeBonus += 10;
  const findBonus = (nphs * 3) + phs + timeBonus;
  const killBonus = (nphs * 3) + (phs * -3) + timeBonus;

  const results = {
    bonus: {
      findBonus,
      killBonus,
    },
    findGame: {
      result: undefined,
      roll: _.random(1, 30) + findBonus,
      target: hg[climate][terrain][season].hunt.success,
    },
    gameFound: {
      size: {
        roll: _.random(1, 30) + killBonus,
        table: game.size,
        result: undefined,
      },
      count: {
        roll: undefined,
        table: undefined,
        result: undefined,
        range: {
          max: undefined,
          min: undefined,
        },
      },
      distance: {
        table: undefined,
        result: undefined,
      },
      animal: undefined,
    },
    gameKilled: {
      missilesUsedTable: undefined,
      gameKilledTable: undefined,
      count: {
        gameKilled: undefined,
        missilesUsed: undefined,
      },
    },
  };

  // check if any game was found
  results.findGame.result = results.findGame.roll <= results.findGame.target;

  // if game was found, find out how big it is and what kind
  if (results.findGame.result) {
    results.gameFound.size.result =
      weightedTableRoll(results.gameFound.size.table, results.gameFound.size.roll);
    results.gameFound.animal = _.sample(animals[results.gameFound.size.result]);
  }

  // if game was found and we know the size, find the table to get a count of how may we found
  if (results.findGame.result) {
    results.gameFound.count.table = game.count[results.gameFound.size.result];
  }

  // if the gamefound.count.table was found we should roll on it
  if (results.gameFound.count.table) {
    // get max roll number
    const maxRoll = _.max(Object.keys(results.gameFound.count.table));
    // roll a number with the max
    results.gameFound.count.roll = _.random(1, maxRoll);
    // roll on the table to get a count range for game found
    results.gameFound.count.range =
      weightedTableRoll(results.gameFound.count.table, results.gameFound.count.roll);
    // with all the information we now have get the number of creatures found
    results.gameFound.count.result =
      _.random(results.gameFound.count.range.min, results.gameFound.count.range.max);
  }

  // if game was found and we know how big it is we should find out how far away it is.
  if (results.gameFound.size.result) {
    results.gameFound.distance.table = game.distance[results.gameFound.size.result];
    results.gameFound.distance.result =
      _.round(
        _.random(results.gameFound.distance.table.min, results.gameFound.distance.table.max), -1);
  }

  // if game was found go ahead and try and kill it
  if (results.findGame.result) {
    const gameTableTranslation = {
      small: {
        3: 1,
        6: 2,
        8: 3,
        12: 4,
      },
      medium: {
        2: 1,
        3: 1,
        6: 2,
        8: 3,
      },
      large: {
        2: 1,
        3: 1,
      },
    };

    // build tables
    const party = (nphs + phs > 4) ? 4 : nphs + phs;
    results.gameKilled.missilesUsedTable = success[party];
    results.gameKilled.gameKilledTable =
      success[gameTableTranslation[results.gameFound.size.result][results.gameFound.count.range.max]]; // eslint-disable-line

    const rolls = [
      weightedTableRoll(results.gameKilled.missilesUsedTable, _.random(0, 30)),
      weightedTableRoll(results.gameKilled.gameKilledTable, _.random(0, 30)),
    ];

    results.gameKilled.rolls = rolls;

    results.gameKilled.count.gameKilled = _.min([...rolls, results.gameFound.count.result]);
    results.gameKilled.count.missilesUsed = _.max(rolls);
  }

  // if game was found - construct a human readable result
  if (results.findGame.result) {
    results.gameFound.result = `${results.gameFound.count.result} ${results.gameFound.animal} (${results.gameFound.size.result}) found at ${results.gameFound.distance.result} yards.`;

    if (results.gameKilled.count.missilesUsed === 0) {
      results.gameFound.result += ' It got away before you could shoot it.';
    } else {
      results.gameFound.result += ` ${results.gameKilled.count.gameKilled} killed with ${results.gameKilled.count.missilesUsed} missiles used.`;
    }
  } else {
    results.gameFound.result = 'No game found.';
  }

  if (verbose) {
    console.log(JSON.stringify(results));
  }

  return results.gameFound.result;
}
