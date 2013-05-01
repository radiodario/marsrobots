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
  if (regexps.grid.test(command))
    gridSize = command.match(regexps.grid)
    grid = new Grid(gridSize[0], gridSize[1]);


  if (regexps.robotPlace.test(command))
    parts§ = command.split
    robot = new Robot(grid, )

};