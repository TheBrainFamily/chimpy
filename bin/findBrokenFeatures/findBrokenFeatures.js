const { uniq } = require('underscore')
const findBrokenFeatures = (testResults) => {
  const foundBroken = [];
  testResults.forEach(feature => {
    feature.elements.forEach(element => {
      element.steps.forEach(step => {
        if (step.result.status !== "passed") {
          foundBroken.push(feature.uri)
        }
      })
    })
  })
  return uniq(foundBroken)
}

module.exports = {
  findBrokenFeatures
}