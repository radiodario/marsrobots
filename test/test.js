


var should = require('chai').should()


// Robot's move around
describe('Robot', function() {
  it('should have a current position');
  it('should have a bearing');
  it('should have a default north bearing');
  it('should move forward correctly');
  it('should turn left correctly');
  it('should turn right correctly');
  it('should be lost if moving off the edge');
  it('should not be lost if another robot fell off an edge');
});


// Mars is the grid
describe('Mars', function() {
  it('should be rectangular');
  it('should be bounded');
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