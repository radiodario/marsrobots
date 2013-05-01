var Robots = require('./src/Robot');
var Grids = require('./src/Grid');


var grid = null;
var robot = null;


function issueCommand(command) {

};

function parseCommand(command) {
  var regexps = {
    grid         : /^(\d{1,2})\s(\d{1,2})\s*$/,
    robotPlace   : /^(\d{1,2})\s(\d{1,2})\s([NSEW])\s*$/,
    robotCommand : /^[LRF]+\s*$/
  };

  // a grid sizing command
  if (regexps.grid.test(command)) {

    gridSize = command.match(regexps.grid);
    grid = new Grid(gridSize[1], gridSize[2]);
    
  }

  // a robot placement command
  if (regexps.robotPlace.test(command)) {
    
    parts = command.match(regexps.robotPlace);
    robot = new Robot(grid, parts[1], parts[2], parts[3]);

  }

  // a robot movement command
  if (regexps.robotCommand.test(command)) {

    console.log(robot.processInstructions(command))

  }

};