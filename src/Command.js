/*
* COMMAND.
*
*  This module parses commands and allows for drawing the world:
*
*    const Command = require('./src/Command');
*
*    Command.parse('LRLRLR', true);
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
      const maxX = parseInt(gridSize[1], 10)
      const maxY = parseInt(gridSize[2], 10)
      grid = Grid(maxX, maxY);
      if (interactive) {
        console.log(`Grid of ${maxX + 1} by ${maxY + 1} created`);
        drawWorld()
      }
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
        if (interactive) {
          drawWorld()
          console.log(`Robot deployed at (${x},${y}) bearing ${bearing}`);
        }
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
      if (interactive) {
        drawWorld()
      }
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

const hor = '─'
const ver = '│'
const ltc = '┌'
const rtc = '┐'
const lbc = '└'
const rbc = '┘'
const mid = '┼'
const lm = '├'
const rm = '┤'
const tm = '┬'
const bm = '┴'
const emp = ' '
const lst = '╳';

const dirs = {
  N: '▲',
  S: '▼',
  E: '▶︎',
  W: '◀︎',
}

const drawWorld = () => {
  // draw the top
  let world = ''

  const drawTopRow = (width) => {
    let row = ltc;
    for (let i = 0; i < width; i++) {
      row += hor;
      if (i !== width -1) row += tm
    }

    row += rtc + '\n'
    return row
  }

  const drawBottomRow = (width) => {
    let row = lbc;
    for (let i = 0; i < width; i++) {
      row += hor
      if (i !== width -1) row += bm
    }

    row += rbc + '\n'
    return row
  }

  const drawMidRow = (width) => {
    let row = lm;
    for (let i = 0; i < width; i++) {
      row += hor
      if (i !== width - 1) row += mid
    }

    row += rm
    return row + '\n'
  }

  const drawRow = (width) => {
    let row = ver
    for (let i = 0; i < width; i++) {
      row += emp
      row += ver
    }
    return row + '\n'
  }

  const width = grid.maxX + 1;
  const height = grid.maxY + 1;

  world += drawTopRow(width)
  for (let i = 0; i < height; i++) {
    world += drawRow(width)
    if (i !== height - 1)
      world += drawMidRow(width)
    else
      world += drawBottomRow(width)
  }

  // translate xy to string pos
  const strpos = (w, h, x, y) => {
    // flip the y axis
    y = Math.abs(y - (h - 1))
    const charsPerRow = (1 + w) * 2
    return ((x * 2) + 1) + (charsPerRow * ((y * 2) + 1))
  }

  if (!robot) {
    console.log(world)
    return;
  }

  let pos = robot.position();
  console.log(`{x:${pos.x}, y:${pos.y}}`)

  const robotPos = strpos(
    width,
    height,
    pos.x,
    pos.y
  );
  const robotChar = pos.lost ? lst : dirs[pos.bearing]
  world = world.substring(0, robotPos) + robotChar + world.substring(robotPos + 1)
  console.log(world)
}

module.exports = { parse, reset, drawWorld }
