var TEST_PAGE_URL = 'http://localhost:9908/test/Main.elm';
var MAX_CHECK_COUNT = 50;
var CHECK_WAITING_INTERVAL_MS = 100;

function TestResultsPage(page) {
  this.page = page;
}

TestResultsPage.prototype.evaluate = function(func) {
  return this.page.evaluate(func);
};

TestResultsPage.prototype.getErrorMessage = function() {
  return this.evaluate(function() {
    return document.body.innerHTML.replace(/<(.*?)>/g, "");
  }).toString('utf-8');
};

TestResultsPage.prototype.isReady = function() {
  return this.evaluate(function(){
    return document.body.querySelector('.test-summary') != null;
  });
};

TestResultsPage.prototype.noTestsFound = function() {
  return this.evaluate(function() {
    return document.title === 'Page Not Found';
  });
};

TestResultsPage.prototype.hasSummary = function() {
  return this.evaluate(function() {
    return !!document.body.querySelector('.json-summary');
  });
};

TestResultsPage.prototype.getSummary = function() {
  var summary = this.evaluate(function() {
    var suiteSummaryJSON = document.body.querySelector('.json-summary').innerHTML;

    return JSON.parse(suiteSummaryJSON);
  });
  summary.testPageUrl = TEST_PAGE_URL;
  return summary;
};

TestResultsPage.prototype.waitForTestsToFinish = function(onSuiteSummary, onError) {
  var self = this;
  var areTestsReady = false;
  var checkCounts = 0;

  if (this.noTestsFound()) {
    onError('ERROR: No tests to run found. Make sure test/Main.elm exists: it provides an entry point for the tests.');
    return;
  }

  setTimeout(function checkIfReady() {
    areTestsReady = self.isReady();
    checkCounts++;
    if (!areTestsReady && (checkCounts < MAX_CHECK_COUNT)) {
      setTimeout(checkIfReady, CHECK_WAITING_INTERVAL_MS);
    } else {
      if (self.hasSummary()) {
        onSuiteSummary(self.getSummary());
      } else {
        onError('ERROR: Could not run tests... More details below:\n' + self.getErrorMessage());
      }
    }
  }, CHECK_WAITING_INTERVAL_MS);
};

TestResultsPage.prototype.open = function(onSuiteSummary, onError) {
  var self = this;

  this.page.open(TEST_PAGE_URL, function(status) {
    if (status !== 'success') {
      onError('ERROR: Unable to open ' + TEST_PAGE_URL + ', exiting...');
      return;
    }
    self.waitForTestsToFinish(onSuiteSummary, onError);
  });
};

module.exports = TestResultsPage;