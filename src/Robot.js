/* 
* ROBOT.
*
*  This module lets you make robots like so:
*
*    var Robots = require('./src/Robots');
*    
*    var MisterGutsy = Robots.Robot(grid, startX, startY, initialBearing);
*    
*    MisterGutsy.processInstructions(instructionString).position();
*    
*/ 

// pass args as options would be nicer
exports.Robot = function(grid, startX, startY, initialBearing) {

  // private stuff, defaults
  var x = (startX > 0) ? startX : 0;
  var y = (startY > 0) ? startY : 0;
  var grid = grid;
  var bearing = (initialBearing) || 'N';
  var lost = false;

  // the robot
  var robot = {};
    
  // parse the instructions string
  //   "parse"
  robot.processInstructions = function(instructions) {
    
    if (instructions.length > 100) 
      throw new Error("Max instruction length exceeded (100/" + instructions.length +")");
    
    var list = instructions.split('')

    list.forEach(function(instruction) {

      if (instruction === 'F') 
        return robot.moveForward();
      if (instruction === 'L') 
        return robot.turnLeft();
      if (instruction === 'R') 
        return robot.turnRight();

      // wrong instruction
      throw new Error("I didn't understand your instruction " + instruction, list); 

    });

    return robot;

  };


  // move the robot one step forward in the
  // direction we're currently facing
  robot.moveForward = function() {
    // we don't move if we're lost
    if (lost)
      return null; // don't move

    // we don't move if someone got lost here
    if (grid.lostHere(x, y, bearing))
      return null;

    // else we check if we can move
    if (grid.canMove(x, y, bearing)) {
      // if we can, we do move
      if (bearing === 'N')
        y++;
      if (bearing === 'S')
        y--;
      if (bearing === 'E')
        x++;
      if (bearing === 'W')
        x--;
      
      return true;
      
    } else { 

      // we couldn't move
      // so we're lost
      lost = true;
      // but we leave a scent
      grid.addScent(x, y, bearing);

      return false;
    }

  };

  // turning map
  var turn = {
    left  :  {'N':'W', 'W':'S', 'S':'E', 'E':'N'},
    right :  {'N':'E', 'E':'S', 'S':'W', 'W':'N'}
  };

  robot.turnLeft = function() {
    if (!lost) bearing = turn.left[bearing];
    return robot;
  };

  robot.turnRight = function() {
    if (!lost) bearing = turn.right[bearing];
    return robot;
  };

  robot.position = function() {
    return  {
      x : x,
      y : y,
      bearing : bearing,
      lost : lost
    };
  };

  return robot;

};




