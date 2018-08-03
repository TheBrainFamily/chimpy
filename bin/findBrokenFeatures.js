const { findBrokenFeatures } = require('./findBrokenFeatures/findBrokenFeatures')

const jsonfile = require('jsonfile')
const jsonOutput = jsonfile.readFileSync(process.argv[2])
console.log(findBrokenFeatures(jsonOutput).join(" "))
