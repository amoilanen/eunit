var request = require('request');
var spawn = require('child_process').spawn;

function launcnElmReactor() {
  return new Promise(function(resolve, reject) {
    var elmReactorProcess = spawn('elm-reactor');

    elmReactorProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    elmReactorProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    elmReactorProcess.on('close', (code) => {
      console.log('elm-reactor closed');
    });
    resolve();
  });
}

function get(url) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
    }, 1000); //TODO: Wait when elm-reactor has been started up
  });
}

launcnElmReactor().then(function() {
  return get('http://localhost:8000/test/Main.elm');
}).then(function(body) {
  console.log(body);
}).catch(function(error) {
  console.log(error);
});

//TODO: Use PhantomJS to connect to the test page, otherwise the test code will not be run

//TODO: When tests have been run and result reported
//reactorProcess.kill();

//TODO: No elm installed globablly? Ask to install it
//TODO: No elm-reactor is yet launched, launch new instance
//TODO: elm-reactor has already been launched, use the existing instance
//TODO: If no test/Main.elm exists, ask to create it

//TODO: Report number of succeeded tests, print OK if tests succeed, print FAIL if some fail, show failed tests names?
//TODO: If there is a syntactic error in the tests report it as well, print the error?