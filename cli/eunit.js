#!/usr/bin/env node
var phantomjs = require('phantomjs');
var path = require('path');
var logger = require('./logger');
var spawn = require('child_process').spawn;
var fs = require('fs-extra');
var processUtils = require('./process');
var pids = processUtils.pids;
var find = processUtils.find;
var terminate = processUtils.terminate;

var initialElmPids = getElmPids();

function getElmPids() {
  var elmPids = pids(find(/elm/));
  return elmPids;
}

function newElmPids() {
  var currentElmPids = getElmPids();
  return currentElmPids.filter(function(elmPid) {
    return initialElmPids.indexOf(elmPid) < 0;
  });
}

function terminateNewElmProcesses() {
  newElmPids().forEach(function(elmPid) {
    terminate(elmPid);
  });
}

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

    terminateNewElmProcesses();
    process.exit(code);
  });
}

function runSuite() {
  var elmReactor = spawn('elm-reactor', ['-p', '9908']);

  elmReactor.on('error', function(err) {
    logger.error('ERROR: Could not launch elm-reactor...'
      + 'Please install Elm and make sure elm-reactor can be launched.');
  });
  launchPhantomJs();
}

const initMode = process.argv.some(function(arg) {
  return arg === 'init' || arg === '--init';
});

function copyExampleTest() {
  const exampleTest = path.resolve(path.join(__dirname, '../example', 'Main.elm'));

  fs.copySync(exampleTest, testEntryPoint);
}

const testEntryPoint = path.resolve(path.join('.', 'test', 'Main.elm'));

if (initMode) {
  copyExampleTest();
  logger.info('Generated example test case in test/Main.elm...');
} else {
  if (!fs.existsSync(testEntryPoint)) {
    logger.error('No tests to run found. Make sure %s exists: '
      + 'it provides an entry point for the tests.', testEntryPoint);
  } else {
    runSuite();
  }
}

//TODO: Publish the Elm package
//TODO: Publish eunit init eunit run the runner package to npmjs

//TODO: Add details how to run eunit/generate unit tests to README
//TODO: Add documentation to install dependency to eunit to elm-package.json (with elm-package)

