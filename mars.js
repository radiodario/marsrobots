// for reading files
var fs = require('fs');

// the command module
var Command = require('./src/Command');

// reads the prompt interactively
// and parses the commands one at a time
function interactivePrompt() {
  var stdin  = process.stdin;
  var stdout = process.stdout;

  // clear the console
  stdout.write('\033[2J\033[0;0H');
  
  // show the mars landscape
  marsScape = fs.readFileSync('marsScape.txt').toString()
  stdout.write('Welcome to Mars Control\n');
  stdout.write(marsScape);
  stdout.write('\nInteractive Prompt - Please issue a command\n');
  stdout.write('ctrl-c to exit\n');

  // a prompt
  stdout.write('> ')
  // wait for input
  stdin.resume();


  // put a listener on data
  stdin.on('data', function(data) {
    data = data.toString().trim();

    Command.parseCommand(data, true); // we pass true here cos it's interactive

    stdout.write('> ');

  })

};


// processes a file with commands
function processFile(filename) {
  try {
    commands = fs.readFileSync(filename, 'utf8').toString().split('\n');
    commands.forEach(function(command) {
      Command.parseCommand(command);
    });
  } catch (error) {
    console.error(error);
  }
};


// here's the run
if (process.argv.length === 2) {
  interactivePrompt()
} else {
  fileName = process.argv[2]; // assume it's the third argument
  processFile(fileName)
}

