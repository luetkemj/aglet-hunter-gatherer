import _ from 'lodash';
const data = require('./hg-table.json');

const chanceForSuccess = JSON.parse(JSON.stringify(data));

const game = {
  size: {
    12: 'small',
    24: 'medium',
    30: 'large',
  },
  count: {
    small: {
      3: {
        min: 1,
        max: 3,
      },
      6: {
        min: 1,
        max: 6,
      },
      9: {
        min: 1,
        max: 8,
      },
      12: {
        min: 1,
        max: 12,
      }
    },
    medium: {
      3: {
        min: 1,
        max: 2,
      },
      6: {
        min: 1,
        max: 3,
      },
      9: {
        min: 1,
        max: 6,
      },
      12: {
        min: 2,
        max: 8,
      }
    },
    large: {
      3: {
        min: 1,
        max: 2,
      },
      6: {
        min: 1,
        max: 3,
      },
    },
  },
  distance: {
    small: {
      min: 20,
      max: 40,
    },
    medium: {
      min: 40,
      max: 60,
    },
    large: {
      min: 60,
      max: 8,
    }
  }
}

const success = {
  1: {
    5: 0,
    10: 1,
    20: 2,
    30: 3,
  },
  2: {
    3: 0,
    6: 1,
    8: 2,
    15: 3,
    22: 4,
    27: 5,
    30: 6,
  },
  3: {
    1: 0,
    2: 2,
    5: 3,
    10: 4,
    18: 5,
    23: 6,
    28: 7,
    30: 8,
  },
  4: {
    1: 0,
    2: 2,
    3: 3,
    5: 4,
    8: 5,
    12: 6,
    18: 7,
    22: 8,
    25: 9,
    27: 10,
    29: 11,
    30: 12,
  },
}

export function forage(climate, terrain, season, verbose) {
  const results = {
    success: {
      result: undefined,
      roll: _.random(1, 30),
      target: chanceForSuccess[climate][terrain][season].forage.success,
    },
    quality: {
      result: undefined,
      roll: _.random(1, 30),
      target: chanceForSuccess[climate][terrain][season].forage.quality,
    },
    result: undefined,
  };

  results.success.result = results.success.roll <= results.success.target;
  results.quality.result = results.quality.roll <= results.quality.target;

  if (results.success.result) {
    results.result = `You found a days worth of rations.`;

    if (results.quality.result === false) {
      results.result = `You found a days worth of rations that will make you sick.`;
    }
  } else {
    results.result = `You didn't find anything edible.`;
  }

  if (verbose) {
    return results;
  }

  return results.result;
}

function weightedTableRoll(table, roll) {
  const keys = Object.keys(table);
  const key = _.find(keys, key => roll <= key);

  return table[key];
}

export function hunt(climate, terrain, season, hunters, proficientHunters, verbose) {
  const results = {
    findGame: {
      result: undefined,
      roll: _.random(1, 30),
      target: chanceForSuccess[climate][terrain][season].hunt.success,
    },
    gameFound: {
      size: {
        roll: _.random(1, 30),
        table: game.size,
        result: undefined,
      },
      count: {
        roll: undefined,
        table: undefined,
        result: undefined,
      },
      distance: {
        table: undefined,
        result: undefined,
      }
    },
    gameKilled: {
      missilesUsedTable: undefined,
      gameKilledTable: undefined,
      count: {
        gameKilled: undefined,
        missilesUsed: undefined,
      },
    }
  }

  // check if any game was found
  results.findGame.result = results.findGame.roll <= results.findGame.target;

  // if game was found, find out how big it is
  if (results.findGame.result) {
    results.gameFound.size.result = weightedTableRoll(results.gameFound.size.table, results.gameFound.size.roll);
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
    results.gameFound.count.range = weightedTableRoll(results.gameFound.count.table, results.gameFound.count.roll);
    // with all the information we now have get the number of creatures found
    results.gameFound.count.result = _.random(results.gameFound.count.range.min, results.gameFound.count.range.max);
  }

  // if game was found and we know how big it is we should find out how far away it is.
  if (results.gameFound.size.result) {
    results.gameFound.distance.table = game.distance[results.gameFound.size.result];
    results.gameFound.distance.result = _.round(_.random(results.gameFound.distance.table.min, results.gameFound.distance.table.max), -1);
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
      }
    }

    // build tables
    results.gameKilled.missilesUsedTable = success[hunters];
    results.gameKilled.gameKilledTable =
      success[gameTableTranslation[results.gameFound.size.result][results.gameFound.count.range.max]];

    const rolls = [
      weightedTableRoll(results.gameKilled.missilesUsedTable, _.random(0, 30)),
      weightedTableRoll(results.gameKilled.gameKilledTable, _.random(0, 30)),
    ];

    results.gameKilled.rolls = rolls;

    results.gameKilled.count.gameKilled = _.min(rolls);
    results.gameKilled.count.missilesUsed = _.max(rolls);
  }

  // if game was found - construct a human readable result
  if (results.findGame.result) {
    results.gameFound.result = `${results.gameFound.count.result} ${results.gameFound.size.result} game found at ${results.gameFound.distance.result} yards.`;

    if (results.gameKilled.count.missilesUsed === 0) {
      results.gameFound.result += ` It got away before you could shoot it.`
    } else {
      results.gameFound.result += ` ${results.gameKilled.count.gameKilled} game killed with ${results.gameKilled.count.missilesUsed} missiles used.`
    }

  } else {
    results.gameFound.result = `No game found.`
  }

  if (verbose) {
    return results;
  }

  return results.gameFound.result;
}
