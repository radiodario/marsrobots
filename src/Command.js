/*
* COMMAND.
*
*  This module has just one function that parses commands:
*
*    var Command = require('./src/Command');
*
*    Command.parseComand('LRLRLR', true);
*/

// load the other modules
const Robot = require('./Robot')
const Grid = require('./Grid')

// regexps for parsing commands
const regexps = {
  grid         : /^(\d+)\s(\d+)\s*$/,
  robotPlace   : /^(\d+)\s(\d+)\s([NSEW])\s*$/,
  robotCommand : /^[LRF]+\s*$/
};


// keep the current robot and grid
let robot = null;
let grid = null;

// interactive is a flag to show more
// verbose output to puny humans.
const parse = (command, interactive) => {

  if (!command) {
    return { robot, grid };
  }

  // a grid sizing command
  if (regexps.grid.test(command)) {
    try {
      gridSize = command.match(regexps.grid);
      const width = parseInt(gridSize[1], 10)
      const height = parseInt(gridSize[2], 10)
      grid = Grid(width, height);
      if (interactive) console.log('Grid', gridSize[1], 'x', gridSize[2], 'created');
    } catch (e) {
      console.error(e.toString())
    }
    return { robot, grid }
  }

  // a robot placement command
  if (regexps.robotPlace.test(command)) {
    if (!grid) {
      console.error('Error - you must set up a grid first')
    } else {
      try {
        parts = command.match(regexps.robotPlace);
        const x = parseInt(parts[1], 10)
        const y = parseInt(parts[2], 10)
        const bearing = parts[3]
        robot = Robot(grid, x, y, bearing);
        if (interactive) console.log('Robot OK');
      } catch (e) {
        console.error(e.toString())
      }
    }
    return { robot, grid }
  }

  // a robot movement command
  if (regexps.robotCommand.test(command)) {
    if (!grid) {
      console.error('Error - you must set up a grid first')
    } else if (!robot) {
      console.error('Error - you must set up a robot first')
    } else {
      console.log(robot.processInstructions(command))
    }
    return { robot, grid }
  }

  console.error('SYNTAX ERROR - COMMAND NOT UNDERSTOOD')
};

const reset = () => {
  robot = null;
  grid = null;
  return { robot, grid }
}

module.exports = { parse, reset }
