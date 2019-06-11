#!/usr/bin/env node

var exec = require('./lib/exec');

exec('npm run prepare');
exec('node ./bin/chimpy.js');
