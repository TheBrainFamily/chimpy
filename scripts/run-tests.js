#!/usr/bin/env node

require('shelljs/global');
var exec = require('./lib/exec');

var nodeIndex = parseInt(env.CIRCLE_NODE_INDEX, 10);
var isCI = !isNaN(nodeIndex);

var run = function (runOnNodeIndex, name, command) {
  if (!isCI || nodeIndex === runOnNodeIndex) {
    echo(name);
    if (exec(command).code !== 0) {
      exit(1);
    }
  }
};

var unitTestsCommand = './node_modules/.bin/jest';
if (isCI) {
  // Prevent exceeding the maximum RAM. Each worker needs ~385MB.
  unitTestsCommand += ' --maxWorkers 4';
}
run(0, 'Running Chimp Unit tests', unitTestsCommand);
