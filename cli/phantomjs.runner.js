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

function waitForTestResults(page, onResultsReady) {
  var areTestsReady = false;
  var checkCounts = 0;
  setTimeout(function checkIfReady() {
    areTestsReady = page.evaluate(function(){
      return document.body.querySelector('.test-summary') != null;
    });
    checkCounts++;
    //console.log('areTestsReady = ', areTestsReady);
    if (!areTestsReady && (checkCounts < 10)) {
      setTimeout(checkIfReady, 100);
    } else {
      var suiteSummary = page.evaluate(function() {
        var suiteSummaryJSON = document.body.querySelector('.json-summary').innerHTML;

        return JSON.parse(suiteSummaryJSON);
      });
      onResultsReady(suiteSummary);
    }
  }, 100);
}

var startTime = new Date();

printNormal('EUnit test runner');
page.open(testPage, function(status) {
  if (status !== 'success') {
    console.log('Unable to open ' + testPage + ', exiting...');
    phantom.exit(1);
  }

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