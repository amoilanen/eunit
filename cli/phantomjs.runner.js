//console.log('Running PhantomJS...');

var page = require('webpage').create();
var system = require('system');

var testPage = 'http://localhost:8000/test/Main.elm';

function getDotReport(suiteSummary) {
  return Array(suiteSummary.passed + 1).join('.') + Array(suiteSummary.failed + 1).join('x');
}

function printRed(message) {
  console.log('\x1b[31m ' + message + ' \x1b[0m');
}

function printNormal(message) {
  console.log('\x1b[36m ' + message + ' \x1b[0m');
}

function getErrorMessage() {
  return page.evaluate(function() {
    return document.body.innerHTML.replace(/<(.*?)>/g, '\1');
  }).toString('utf-8');
}

function hasSummary() {
  return page.evaluate(function() {
    return !!document.body.querySelector('.json-summary');
  });
}

function getSummary() {
  return  page.evaluate(function() {
    var suiteSummaryJSON = document.body.querySelector('.json-summary').innerHTML;

    return JSON.parse(suiteSummaryJSON);
  });
}

function waitForTestResults(page, onResultsReady) {
  var areTestsReady = false;
  var checkCounts = 0;

  var noTestsFound = page.evaluate(function() {
    return document.title === 'Page Not Found';
  });
  if (noTestsFound) {
    printRed('ERROR: No tests to run found. Make sure test/Main.elm exists: it provides an entry point for the tests.');
    phantom.exit(1);
  }

  setTimeout(function checkIfReady() {
    areTestsReady = page.evaluate(function(){
      return document.body.querySelector('.test-summary') != null;
    });
    checkCounts++;
    //console.log('areTestsReady = ', areTestsReady);
    if (!areTestsReady && (checkCounts < 10)) {
      setTimeout(checkIfReady, 100);
    } else {
      if (hasSummary()) {
        onResultsReady(getSummary());
      } else {
        printRed('ERROR: Could not run tests... More details below:');
        printRed(getErrorMessage());
        phantom.exit(1);
      }
    }
  }, 100);
}

var startTime = new Date();
page.open(testPage, function(status) {
  if (status !== 'success') {
    printRed('ERROR: Unable to open ' + testPage + ', exiting...');
    phantom.exit(1);
  }

  printNormal('EUnit test runner');
  //console.log('Page ' + testPage + ' was opened');

  printNormal('Running test suite...');
  waitForTestResults(page, function(suiteSummary) {
    //console.log('suiteSummary = ', JSON.stringify(suiteSummary));
    printNormal(suiteSummary.description);
    printNormal(getDotReport(suiteSummary));
    var endTime = new Date();
    printNormal('Elapsed time: ' + (endTime.getTime() - startTime.getTime()) + 'ms');
    printNormal('Passed: ' + suiteSummary.passed);
    if (suiteSummary.failed > 0) {
      printRed('FAILED: ' + suiteSummary.failed);
      printRed('Open ' + testPage + ' in a browser for more details.')
      phantom.exit(1);
    }
    printNormal('Done.');
    phantom.exit();
  });
});