marsrobots
==========

They were robots on a strange planet. Sometimes, they fell off the planet, but they learnt fast.



## Interactive version
run `node mars`

you can issue commands to the robot control system:
* `x y` <- set up a grid of `x` by `y`
* `x y B` <- put a new robot on `x`, `y` with bearing `B`
* `[LRF]+` <- give the robot some commands

## File parser mode
run `node mars commands.mars`

## running tests
```
npm install && mocha -R nyan
```