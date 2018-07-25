| **[Home](/chimpy)** |

Since Chimpy uses Selenium, you get the benefit of using all of the cloud based testing services.

Here is a sample command that you could use to setup a connection with Sauce Labs:
```
chimpy --host="ondemand.saucelabs.com" --port=80 --key="SAUCE_KEY" 
      --user="SAUCE_USER" --name="foo"
```

You can also put these settings in a configuration file like this:

```javascript
module.exports = {
  user: "SAUCE_USER",
  key: "SAUCE_KEY",
  port: 80,
  host: "ondemand.saucelabs.com",
  name: "foo"
};
```

See the [Configuration page](/configuration.md) for more details on setting up a configuration file.


### Browser Stack Example
```
module.exports = {
    user: "My Browserstack Username",
    key: "My Browserstack Access Key",
    port: 80,
    host: "hub-cloud.browserstack.com",
    browser: "Chrome",

    // - - - - WEBDRIVER-IO  - - - -
    webdriverio: {
        desiredCapabilities: {
            'browserstack.local': true,
            'build': 'My Build',
            'project': 'My Project Name',
            'os' : 'Windows',
            'os_version' : '7'
        }
    },
};
```

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.
