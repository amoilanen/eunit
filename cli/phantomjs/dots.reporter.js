var logger = require('../logger');

function DotsReporter() {
}

function getDotReport(suiteSummary) {
  return Array(suiteSummary.passed + 1).join('.') + Array(suiteSummary.failed + 1).join('x');
}

DotsReporter.prototype.start = function() {
  this.startTime = new Date();
  logger.info('EUnit test runner');
  logger.info('Running test suite...');
};

DotsReporter.prototype.report = function(suiteSummary) {
  logger.info(suiteSummary.description);
  logger.info(getDotReport(suiteSummary));
  var endTime = new Date();
  logger.info('Elapsed time: ' + (endTime.getTime() - this.startTime.getTime()) + 'ms');
  logger.info('Passed: ' + suiteSummary.passed);
  if (suiteSummary.failed > 0) {
    logger.error('FAILED: ' + suiteSummary.failed);
    logger.error('To debug run \'elm-reactor -p 9908 \' and open ' + suiteSummary.testPageUrl
      + ' in a browser for more details.');
  } else {
    logger.info('Done.');
  }
};

module.exports = DotsReporter;