var phantomjs = require('phantomjs');
var path = require('path');
var logger = require('./logger');
var spawn = require('child_process').spawn;

function launchPhantomJs() {
  const runnerScript = path.join(__dirname, 'phantomjs.runner.js');
  var phantomjsProcess = spawn(phantomjs.path, [runnerScript]);

  phantomjsProcess.stdout.on('data', (data) => {
    logger.info(data.toString());
  });
  phantomjsProcess.stderr.on('data', (data) => {
    logger.info(data.toString());
  });
  phantomjsProcess.on('close', (code) => {
    process.exit(code);
  });
}

/*
 * elm-reactor spawns 2 processes, only one of them can be terminated from Node, then some partial elm-reactor is running
 * We choose not to terminate elm-reactor and ignore an attempt to spawn it if it is already running.
 */
var elmReactor = spawn('elm-reactor', []);
elmReactor.on('error', function(err) {
  logger.error('ERROR: Could not launch elm-reactor... Please install Elm and make sure elm-reactor can be launched.');
});
launchPhantomJs();

//TODO: Error handling: No elm installed globablly? Ask to install it - OK
//TODO: Error handling: If no test/Main.elm exists, ask to create it - OK
//TODO: Error handling: If there is a syntactic error in the tests report it as well, print the error? - OK
//TODO: Re-factor the test runner - OK

//TODO: 'eunit init' generates the test in the current project, adds necessary Elm artifact dependency
//TODO: Add details how to run eunit/generate unit tests to README
//TODO: Publish eunit init eunit run the runner package to npmjs
//TODO: Publish the Elm package