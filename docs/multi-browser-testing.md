| **[Home](/chimpy)** |

To test using multiple browsers you need to use environment variable like so:

```shell
export CUCUMBER_BROWSERS=2
```

This will expose the browser instances in global browser.instances variable. There are different ways of using this, but here is some code example for inspiration:

```javascript
var browsers;

this.Before(function() {
  browsers = {
    Alice: browser.instances[0],
    Bob: browser.instances[1]
  };
})

this.Given(/^([^ ]*) go(?:es)? to "([^"]*)"$/, function (person, relativePath) {
  getBrowserFor(person).url(url.resolve(process.env.ROOT_URL, relativePath));
});

this.Then(/^([^ ]*) sees? "([^"]*)" label$/, function (person, label) {
  var _labelSelector = "//*//label[text()='" + label + "']";
  expect(getBrowserFor(person).isVisible(_labelSelector)).toBe(true);
});


function getBrowserFor(person) {
  return (person === 'Both') ? browser : browsers[person];
}
```

Then you can use Bob and Alice in your .feature files:

```gherkin
  Scenario: Login into the system
    Given Both go to "/"
    Then Alice sees "Very nice" label
    And Bob sees "Very nice" label
```

In production code you'd probably want to make the browsers variable global and expose it to your step definitions.
