var phantomjs = require('phantomjs');
var path = require('path');
var spawn = require('child_process').spawn;

var elmReactorProcess;

function launcnElmReactor() {
  return new Promise(function(resolve, reject) {
    elmReactorProcess = spawn('elm-reactor');

    elmReactorProcess.stdout.on('data', (data) => {
      //console.log(data.toString());
    });
    elmReactorProcess.stderr.on('data', (data) => {
      //console.log(data.toString());
    });
    elmReactorProcess.on('close', (code) => {
      //console.log('elm-reactor closed');
    });
    resolve();
  });
}

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
    /*
    TODO: Make sure that elm-reactor process is stopped
    //TODO: When tests have been run and result reported
//reactorProcess.kill();
    elmReactorProcess.stdin.pause();
    elmReactorProcess.kill();
    */
    process.exit(code);
  });
}

launcnElmReactor().then(function() {
  launchPhantomJs();
});


//TODO: Error handling: No elm installed globablly? Ask to install it

//TODO: No elm-reactor is yet launched, launch new instance
//TODO: elm-reactor has already been launched, use the existing instance

//TODO: Error handling: If no test/Main.elm exists, ask to create it

//TODO: Error handling: If there is a syntactic error in the tests report it as well, print the error?