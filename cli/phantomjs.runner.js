var page = require('webpage').create();
var logger = require('./logger');
var DotsReporter = require('./phantomjs/dots.reporter.js');
var TestResultsPage = require('./phantomjs/test.results.page.js');

function runTests() {
  var reporter = new DotsReporter();
  var resultsPage = new TestResultsPage(page);

  reporter.start();
  resultsPage.open(function onSuiteSummary(suiteSummary) {
    reporter.report(suiteSummary);
    if (suiteSummary.failed > 0) {
      phantom.exit(1);
    }
    phantom.exit();
  }, function onError(errorMessage) {
    logger.error(errorMessage);
    phantom.exit(1);
  });
}

runTests();