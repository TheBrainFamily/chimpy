#!/usr/bin/env node

require('@babel/register')

// be sure to run `npm run prepare` first to generate the dist dir
require('../dist/bin/chimp');
