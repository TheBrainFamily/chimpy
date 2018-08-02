const { findBrokenFeatures } = require('./findBrokenFeatures')
const oneBroken = require('./sample-for-test.json')

test('works', () => {
  const listOfFailingFeatures = findBrokenFeatures(oneBroken)
  expect(listOfFailingFeatures).toEqual( ["/Users/user/projects/prototypes/chimpRerun/features/test.feature"])
})
