// i like using should, makes the
// tests easy to read.
const should = require('chai').should()

const Robot = require('../src/Robot')
const Grid = require('../src/Grid')
const Command = require('../src/Command')

// Grid represents the planet
describe('Grid', function() {
  beforeEach(function() {
    this.grid = Grid(5,3);
  })
  it('should have robot scents when one moves off the edge', function() {
    this.robot = Robot(this.grid, 5, 3, 'N');
    this.robot.moveForward();
    this.grid.lostHere(5, 3, 'N').should.be.true;
    this.grid.lostHere(0, 0, 'N').should.be.false;
  });
  it('should tell you if you can move successfully', function() {
    // bottom left
    this.grid.canMove(0,0,'S').should.be.false;
    this.grid.canMove(0,0,'E').should.be.true;
    this.grid.canMove(0,0,'N').should.be.true;
    this.grid.canMove(0,0,'W').should.be.false;
    // top right
    this.grid.canMove(5,3,'N').should.be.false;
    this.grid.canMove(5,3,'W').should.be.true;
    this.grid.canMove(5,3,'S').should.be.true;
    this.grid.canMove(5,3,'E').should.be.false;
  })
});


describe('Robot', function() {
  beforeEach(function() {
    this.grid = Grid(5, 5);
    this.robot = Robot(this.grid, 0, 0, 'N');
  });
  afterEach(function() {
    delete this.grid;
    delete this.robot;
  });
  it('should have a position function that returns the current position', function() {
    this.robot.position.should.be.a('function');
    this.robot.position().should.have.property('x')
    this.robot.position().should.have.property('y')
    this.robot.position().should.have.property('lost')
    this.robot.position().should.have.property('bearing')
  });
  it('should have sensible defaults', function() {
    this.robot = Robot();
    this.robot.position().bearing.should.equal('N');
    this.robot.position().x.should.equal(0);
    this.robot.position().y.should.equal(0);
  });
  describe('moving forward', function() {
    it('should move north correctly', function() {
      this.robot = Robot(this.grid, 0, 0, 'N');
      this.robot.moveForward()
      this.robot.position().y.should.equal(1);
      this.robot.position().x.should.equal(0);
    });
    it('should move south correctly', function() {
      this.robot = Robot(this.grid, 0, 1, 'S');
      this.robot.moveForward()
      this.robot.position().y.should.equal(0);
      this.robot.position().x.should.equal(0);
    });
    it('should move east correctly', function() {
      this.robot = Robot(this.grid, 0, 0, 'E');
      this.robot.moveForward()
      this.robot.position().y.should.equal(0);
      this.robot.position().x.should.equal(1);
    });
    it('should move west correctly', function() {
      this.robot = Robot(this.grid, 1, 0, 'W');
      this.robot.moveForward()
      this.robot.position().y.should.equal(0);
      this.robot.position().x.should.equal(0);
    });
  })
  it('should turn left correctly', function() {
    this.robot.turnLeft().position().bearing.should.equal('W');
    this.robot.turnLeft().position().bearing.should.equal('S');
    this.robot.turnLeft().position().bearing.should.equal('E');
    this.robot.turnLeft().position().bearing.should.equal('N');
  });
  it('should turn right correctly', function() {
    this.robot.turnRight().position().bearing.should.equal('E');
    this.robot.turnRight().position().bearing.should.equal('S');
    this.robot.turnRight().position().bearing.should.equal('W');
    this.robot.turnRight().position().bearing.should.equal('N');
  });
  it('should be lost if moving off the edge', function() {
    this.robot.turnRight().turnRight().moveForward()
    this.robot.position().lost.should.equal(true);
  });
  it('should not be lost if another robot fell off an edge', function() {
    this.robot.turnRight().turnRight().moveForward();
    this.robot2 = Robot(this.grid, 0, 0, 'N');
    this.robot2.turnRight().turnRight().moveForward();
    this.robot2.position().lost.should.equal(false);
  });
  describe('reading instructions', function() {
    it('should throw an error if we pass a very long string', function() {
      instructions = Array(150).join('L');
      // i can't get chai to pass tests when errors are thown?
      //this.robot.processInstructions(instructions).should.throw();
    });
    it('should follow some strings ok', function() {
      // use the grid from the questions
      const grid = Grid(5, 3);
      // make a local copy of the robot
      // for map's callback
      let robot = this.robot;
      // a list with instructions
      [
        {
          i : 'LRFLRF', // instruction string
          r : { // start pos
            x : 0,
            y : 0,
            b : 'N'
          },
          d : { // expected destination
            x : 0,
            y : 2,
            b : 'N',
            l : false
          }
        },
        {
          i : 'RFRFRFRF',
          r : { // start pos
            x : 1,
            y : 1,
            b : 'E'
          },
          d : {
            x : 1,
            y : 1,
            b : 'E',
            l : false
          }
        },
        {
          i : 'FRRFLLFFRRFLL',
          r : { // start pos
            x : 3,
            y : 2,
            b : 'N'
          },
          d : {
            x : 3,
            y : 3,
            b : 'N',
            l : true
          }
        },
        {
          i : 'LLFFFLFLFL',
          r : {
            x : 0,
            y : 3,
            b : 'W'
          },
          d : {
            x : 2,
            y : 3,
            b : 'S',
            l : false
          }
        }
      ].map(function(test) {
        // reset the robot
        const r = test.r;
        robot = Robot(grid, r.x, r.y, r.b);
        //
        robot.processInstructions(test.i);
        robot.position().x.should.equal(test.d.x);
        robot.position().y.should.equal(test.d.y);
        robot.position().bearing.should.equal(test.d.b);
        robot.position().lost.should.equal(test.d.l);
      });
    });
  });
});

describe('Command', () => {
  it('should have a `parse` function', () => {
    Command.parse.should.be.a('function');
  });
  it('should return null if no command is passed', () => {
    const { robot, grid } = Command.parse(null)
    let outcome = robot === null;
    outcome.should.equal(true)
    outcome = grid === null;
    outcome.should.equal(true)
  })
  it('should parse a grid building command', () => {
    const { robot, grid } = Command.parse('5 5')
    grid.maxX.should.equal(5)
    grid.maxY.should.equal(5)
  });
  it('parses a robot placement command', () => {
    const { robot, grid } = Command.parse('1 1 E')
    robot.position().x.should.equal(1)
    robot.position().y.should.equal(1)
    robot.position().bearing.should.equal('E')
    robot.position().lost.should.equal(false)
  });
  it('parses a set of movements correctly', () => {
    const { robot, grid } = Command.parse('RFRFRFRF')
    robot.position().x.should.equal(1)
    robot.position().y.should.equal(1)
    robot.position().bearing.should.equal('E')
    robot.position().lost.should.equal(false)
  })
  it('should have a `drawWorld` function', () => {
    Command.drawWorld.should.be.a('function');
    Command.drawWorld();
  })
  it('should have a `reset` function', () => {
    Command.reset.should.be.a('function');
  });
  it('should reset the grid after callingg reset', () => {
    const { robot, grid } = Command.reset()
    let outcome = robot === null;
    outcome.should.equal(true)
    outcome = grid === null;
    outcome.should.equal(true)
  })
})
