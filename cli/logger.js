function error() {
  var args = [].slice.call(arguments, 0);
  args[0] = '\x1b[31m ' + args[0] + ' \x1b[0m';
  console.log.apply(console, args);
}

function info() {
  var args = [].slice.call(arguments, 0);
  args[0] = '\x1b[36m ' + args[0] + ' \x1b[0m';
  console.log.apply(console, args);
}

module.exports = {
  info: info,
  error: error
};