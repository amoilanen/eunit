function error(message) {
  console.log('\x1b[31m ' + message + ' \x1b[0m');
}

function info(message) {
  console.log('\x1b[36m ' + message + ' \x1b[0m');
}

module.exports = {
  info: info,
  error: error
};