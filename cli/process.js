var os = require('os');
var execSync = require('child_process').execSync;

function list() {
  return isWindows() ?
    listWin() :
    listStandard();
}

function isWindows() {
  return os.platform().indexOf('win') >= 0;
}

function listWin() {
  var processesStatus = execSync('tasklist').toString('utf-8');

  return processesStatus.split('\r\n').map(function(processLine) {
    var processStringFields = processLine.split(/\s+/);

    return {
      name: processStringFields[0],
      pid: parseInt(processStringFields[1])
    };
  });
}

function listStandard() {
  var processesStatus = execSync('ps ax| awk \'{\n' +
  'printf("%s", $1)\n' + 
  'printf(":")\n' +
  'for (i = 5; i <= NF; i++) {\n' +
    'printf("%s ", $i)\n' +
  '}\n' +
  'printf("\\n")}\'').toString('utf-8');

  return processesStatus.split('\n').map(function(processLine) {
    var processStringFields = processLine.split(':');

    return {
      name: processStringFields[1],
      pid: parseInt(processStringFields[0])
    };
  });
}

function terminate(pid) {
  return isWindows() ?
    terminateWin(pid) :
    terminateStandard(pid);
}

function terminateWin(pid) {
  execSync('taskkill /pid ' + pid + ' /f');
}

function terminateStandard(pid) {
  execSync('kill ' + pid);
}

function find(wildcard) {
  var processes = list();

  return processes.filter(function(process) {
    return !!process.name && !!process.name.match(wildcard)
  });
}

function pids(processes) {
  return processes.map(function(process) {
    return process.pid;
  });
}

module.exports = {
  find: find,
  pids: pids,
  terminate: terminate,
  list: list
};