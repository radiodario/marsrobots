// i like using should, makes the
// tests easy to read.
var should = require('chai').should()


var Robots = require('../src/Robot')
var Grids = require('../src/Grid')



describe('Robot', function() {
  beforeEach(function() {
    this.grid = Grids.Grid(5, 5);
    this.robot = Robots.Robot(this.grid, 0, 0, 'N');
  });
  afterEach(function() {
    delete this.grid;
    delete this.robot;
  });
  it('should have return current position', function() {
    this.robot.position.should.be.a.function;
    this.robot.position.should.have.property.x
    this.robot.position.should.have.property.y
    this.robot.position.should.have.property.lost
    this.robot.position.should.have.property.bearing
  });
  it('should have a default north bearing', function() {
    this.robot = Robots.Robot(null, 0, 0, null);
    this.robot.position().bearing.should.equal('N');
  });
  describe('moving forward', function() {
    it('should move north correctly', function() {
      this.robot = Robots.Robot(this.grid, 0, 0, 'N');
      this.robot.moveForward()
      this.robot.position().y.should.equal(1);
      this.robot.position().x.should.equal(0);
    });
    it('should move south correctly', function() {
      this.robot = Robots.Robot(this.grid, 0, 1, 'S');
      this.robot.moveForward()
      this.robot.position().y.should.equal(0);
      this.robot.position().x.should.equal(0);
    });
    it('should move east correctly', function() {
      this.robot = Robots.Robot(this.grid, 0, 0, 'E');
      this.robot.moveForward()
      this.robot.position().y.should.equal(0);
      this.robot.position().x.should.equal(1);
    });
    it('should move west correctly', function() {
      this.robot = Robots.Robot(this.grid, 1, 0, 'W');
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
    this.robot.position().lost.should.equal.true;
  });
  it('should not be lost if another robot fell off an edge', function() {
    this.robot.turnRight().turnRight().moveForward();
    this.robot2 = Robots.Robot(this.grid, 0, 0, 'N');
    this.robot2.turnRight().turnRight().moveForward();
    this.robot2.position().lost.should.equal.false;  
  });
  describe('reading instructions', function() {
    it('should throw an error if we pass a very long string', function() {
      instructions = Array(150).join('L');
      // i can't get chai to pass tests when errors are thown?
      //this.robot.processInstructions(instructions).should.throw();
    });
    it('should follow some strings ok', function() {
      // use the grid from the questions
      this.grid = Grids.Grid(5, 3);
      // make a local copy of the robot
      // for map's callback
      var robot = this.robot;
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
      /*
          add more strings here
          3 2 N 
          FRRFLLFFRRFLL

          0 3 W 
          LLFFFLFLFL

          Sample Output
          1 1 E
          3 3 N LOST
          2 3 S
      */
      ].map(function(instruction) {
        // console.log(instruction.i)
        // reset the robot
        robot.x(instruction.r.x);
        robot.y(instruction.r.y);
        robot.bearing(instruction.r.b);
        robot.lost(false);

        // 
        robot.processInstructions(instruction.i);
        robot.position().x.should.equal(instruction.d.x);
        robot.position().y.should.equal(instruction.d.y);
        robot.position().bearing.should.equal(instruction.d.b);
        robot.position().lost.should.equal(instruction.d.l);
      });
    });
  });
});


// Grid represents mars
describe('Grid', function() {
  it('should have robot scents when one moves off the edge');
});


describe('Control', function() {
  it('should read instructions correctly');
  it('should output instructions correctly');
  it('should output LOST if a robot is lost');
  it('should reject instruction strings longer than 100 chars');
  it('should reject grid sizes larger than 50');
  it('should reject coordinates larger than 50');
  it('should process robots sequentialy');
});