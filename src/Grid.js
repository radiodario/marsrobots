/* 
* A GRID!
*
* you can call it like this:
*
*    var Grids = require('./src/Grid');
*    var mars = Grids.Grid(maxX, maxY);
*    
*/

exports.Grid = function(maxX, maxY) {
  // make sure there's an error thrown if you ask
  // for a planet that's too big
  if ((maxX > 50) || (maxY > 50))
    throw new Error("Sorry sir, we can only simulate planets of 50x50")

  // scents contains a bunch of positions where 
  var scents = [];


  var grid = {};

  grid.lostHere = function(x, y, bearing) {
    var currentPos = x + ',' + y + ',' + bearing;
    // assume we have indexOf
    return scents.indexOf(currentPos) >= 0
  };

  grid.addScent = function(x, y, bearing) {
    scents.push(x + ',' + y + ',' + bearing);
  };

  grid.canMove = function(x, y, bearing) {

    // edge cases
    if (x < 0)
      return false
    if (x > maxX)
      return false
    if (y < 0)
      return false
    if (y > maxY)
      return false

    // normal checks
    switch (bearing) {
      case 'N':
        return (y < maxY);
      case 'S':
        return (y > 0);
      case 'E':
        return (x < maxX);
      case 'W':
        return (x > 0);
      default:
        throw new Error('Your bearing is wrong: ' + bearing);
    };

  }

  return grid;

};