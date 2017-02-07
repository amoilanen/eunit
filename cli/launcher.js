var phantomjs = require('phantomjs');
var path = require('path');
var spawn = require('child_process').spawn;

function launchPhantomJs() {
  const runnerScript = path.join(__dirname, 'phantomjs.runner.js');
  var phantomjsProcess = spawn(phantomjs.path, [runnerScript]);

  phantomjsProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  phantomjsProcess.stderr.on('data', (data) => {
    console.log(data.toString());
  });
  phantomjsProcess.on('close', (code) => {
    if (code != 0) {
      //console.log('Runner failed!');
    } else {
      //console.log('Runner succeeded');
    }
    process.exit(code);
  });
}

/*
 * elm-reactor spawns 2 processes, only one of them can be terminated from Node, then some partial elm-reactor is running
 * We choose not to terminate elm-reactor and ignore an attempt to spawn it if it is already running.
 */
var elmReactor = spawn('elm-reactor', []);
elmReactor.on('error', function(err) {
  console.log('ERROR: Could not launch elm-reactor... Please install Elm and make sure elm-reactor can be launched.');
});
launchPhantomJs();

//TODO: Error handling: No elm installed globablly? Ask to install it - OK
//TODO: Error handling: If no test/Main.elm exists, ask to create it - OK
//TODO: Error handling: If there is a syntactic error in the tests report it as well, print the error?'
//TODO: Re-factor the test runner