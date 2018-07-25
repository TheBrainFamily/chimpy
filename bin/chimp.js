#!/usr/bin/env node
const log = require('../dist/lib/log.js');
const colors = require('colors');
colors.enabled = true;
log.info("\n\nThanks for using Chimpy!".green);

log.info("\nPlease change your chimp calls to chimpy.".yellow, "\nUsing the old name - chimp - to run chimpy is deprecated.\nIn the near future it will collide with chimp 2.0 project.\n\n".yellow );

setTimeout(() => {
    require('../dist/bin/chimp');
}, 5000);