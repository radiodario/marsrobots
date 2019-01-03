/*
* A GRID!
*
* you can call it like this:
*
*    var Grids = require('./src/Grid');
*    var mars = Grids.Grid(maxX, maxY);
*
*/

const Grid = (maxX, maxY) => {
  // make sure there's an error thrown if you ask
  // for a planet that's too big
  if ((maxY > 50) || (maxX > 50))
    throw new Error("Sorry sir, we can only simulate planets of 50x50")

  // scents contains a bunch of positions where
  let scents = [];

  let grid = { maxY, maxX, scents };

  grid.lostHere = function(x, y, bearing) {
    const i = x + maxX * y

    return scents[i] ? scents[i][bearing] : false
  };

  grid.addScent = function(x, y, bearing) {
    const i = x + maxX * y

    scents[i] ? scents[i][bearing] = true : scents[i] = { [bearing] : true }
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

module.exports = Grid
