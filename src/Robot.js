/*
* ROBOT.
*
*  This module lets you make robots like so:
*
*    const Robot = require('./src/Robot');
*
*    const MisterGutsy = Robot(grid, startX, startY, initialBearing);
*
*    MisterGutsy.processInstructions(instructionString).position();
*
*/

// pass args as options would be nicer
const Robot = (grid, x = 0, y = 0, initialBearing = 'N') => {

  // private stuff, defaults
  let lost = false;
  let bearing = initialBearing;
  // the robot
  let robot = {};

  // parse the instructions string
  //   "parse"
  robot.processInstructions = function(instructions) {

    if (instructions.length > 100)
      throw new Error("Max instruction length exceeded (100/" + instructions.length +")");

    const list = instructions.split('')

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

    const result = `${x} ${y} ${bearing}${lost ? ' LOST' : ''}`;

    return result;
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
  const turn = {
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


  // get/setters

  robot.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return robot;
  };

  robot.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return robot;
  };

  robot.lost = function(_) {
    if (!arguments.length) return lost;
    return lost;
  }

  robot.bearing = function(_) {
    if (!arguments.length) return bearing;
    bearing = _;
    return robot;
  };

  // a nice object with the pos.
  robot.position = function() {
    return  {
      x,
      y,
      bearing,
      lost,
    };
  };

  return robot;

};

module.exports = Robot
