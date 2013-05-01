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
var Robots = require('./Robot');
var Grids = require('./Grid');

// regexps for parsing commands
var regexps = {
  grid         : /^(\d+)\s(\d+)\s*$/,
  robotPlace   : /^(\d+)\s(\d+)\s([NSEW])\s*$/,
  robotCommand : /^[LRF]+\s*$/
};

// keep the current robot and grid
var robot = null;
var grid = null;

// interactive is a flag to show more 
// verbose output to puny humans.
exports.parseCommand = function(command, interactive) {

  if (!command) {
    return
  }

  // a grid sizing command
  if (regexps.grid.test(command)) {
    try {
      gridSize = command.match(regexps.grid);
      grid = Grids.Grid(gridSize[1], gridSize[2]);
      if (interactive) console.log('Grid', gridSize[1], 'x', gridSize[2], 'created');
    } catch (e) {
      console.error(e.toString())
    } 
    return
  }

  // a robot placement command
  if (regexps.robotPlace.test(command)) {
    if (!grid) {
      console.log('Error - you must set up a grid first')
    } else {
      try {
        parts = command.match(regexps.robotPlace);
        robot = Robots.Robot(grid, parts[1], parts[2], parts[3]);
        if (interactive) console.log('Robot OK');
      } catch (e) {
        console.error(e.toString())
      } 
    }
    return
  }

  // a robot movement command
  if (regexps.robotCommand.test(command)) {
    if (!grid) {
      console.log('Error - you must set up a grid first')
    } else if (!robot) {
      console.log('Error - you must set up a robot first')
    } else {
      console.log(robot.processInstructions(command))
    }
    return
  }

  console.log('SYNTAX ERROR - COMMAND NOT UNDERSTOOD')
};