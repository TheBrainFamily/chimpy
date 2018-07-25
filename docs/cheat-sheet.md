| **[Home](/chimpy)** |

The following is a list of examples of how to do common tasks and assertions using:
* Webdriver.io
* Synchronous execution
* Jasmine expectations

*[Click here the full WebdriverIO API](http://webdriver.io/api.html)*

The variable `browser` is a handle to webdriver. It is shorthand for, or the equivalent of:

`var webdriverio = require('webdriverio');
var options = {};
var browser=webdriverio.remote(options)`

###### Assert that element exists in DOM
```javascript
const doesExist = client.waitForExist("selector");

expect(doesExist).toBe(true);
```

###### Assert that element is not in DOM (removed)
Make sure to wait for the parent element to exist. The parent and checked element should be rendered at the same time for the check to not give a false positive.

Use `null` for second parameter to keep default wait timeout. Third parameter negates the check.

```javascript
client.waitForExist("parentSelector");
const doesNotExist = client.waitForExist("childElement", null, true);

expect(doesNotExist).toBe(true);
```

###### Assert on number of elements in DOM
```javascript
client.waitForExist("selector");
const elements = client.elements("selector");

expect(elements.value.length).toEqual(2);
// expect(elements.value.length).toBeGreaterThan(2);
// expect(elements.value.length >= 2).toBe(true);
```

###### Assert that a single element has text value (assuming only 1 match exists for the selector)
```javascript
client.waitForExist("selector");
client.moveToObject("selector");
const actualText = client.getText("selector");

expect(actualText).toEqual("text");
```

###### Assert that a single element in a list of matches for a selector has text value
```javascript
client.waitForExist("selector");
const elements = client.elements("selector");
const element = elements.value[<index_of_the_desired_element>];
client.moveTo(element.ELEMENT);
const actualText = client.elementIdText(element.ELEMENT).value;
expect(actualText).toEqual("text");
```

###### Find a single element in a list of matches based on its text value
```javascript
const elements = client.elements("selector");
let matchingElementId = null;
for (const element of elements.value) {
    const text = client.elementIdText(element.ELEMENT).value;
    if (text === textToMatch) {
        matchingElementId = element.ELEMENT;
        break;
    }
}
expect(matchingElementId).not.toBe(null);
client.moveTo(matchingElementId);
```

###### Assert that element has class
```javascript
client.waitForExist("selector");
const cssClass = client.getAttribute("selector", "class");

expect(cssClass).toContain("my-custom-class");
```

###### Click a single element (assuming only 1 match exists for the selector)
```javascript
client.waitForExist("selector");
client.moveToObject("selector");
client.click("selector");
```

###### Click a single element in a list of matches for a selector
```javascript
client.waitForExist("selector");
const elements = client.elements("selector");
const element = elements.value[<index_of_the_desired_element>];
client.moveTo(element.ELEMENT);
client.elementIdClick(element.ELEMENT);
```

###### Move to an element
```javascript
client.waitForExist("selector");
client.moveToObject("selector");
```

###### Drag an element
```javascript
client.waitForExist("selector");
client.moveToObject("selector", 0, 0);
client.buttonDown();
client.moveToObject("selector", 50, 5);
client.buttonUp();
```

###### Assert on an elements x position
```javascript
client.waitForExist("selector");
const x = client.getLocation("selector", "x") // Get x or y, if not specified, an object {x, y} is returned.

expect(x).toEqual(50);
```

###### Execute custom action (in this case trigger mouseenter on an element)
```javascript
client.waitForExist("selector");
client.selectorExecute("selector", function(element) {
    $(element).trigger("mouseenter");
});
```

###### Assert on url navigation
```javascript
browser .url(url + path)
expect(browser.getUrl()).toEqual(url + path)
```

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.