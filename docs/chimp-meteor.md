| **[Home](/chimpy)** |

## Getting Started

Follow the [Installation](doc:installation) instructions.

Note, The official Meteor guide also has some instructions on using Chimp for acceptance testing that [you can find by clicking here](http://guide.meteor.com/testing.html#acceptance-testing).

Ensure that your features and tests are in a tests folder; you will encounter a `ReferenceError: module is not defined` error once you start to create your step definitions if they are not.

Start your Meteor application then start Chimp:

```shell
# Cucumber mode
mkdir tests
chimp --ddp=http://localhost:3000 --watch --path=tests

# Mocha mode
chimp --ddp=http://localhost:3000 --watch --mocha --path=tests
```

Chimp will now watch the `tests` directory and rerun if any of those change, or if the Meteor app restarts, so you can enjoy a lightning-fast reactive testing experience.

Chimp uses Google Chrome by default so you need to install it. If you don't wish to use Chrome, you can specify the `--browser=firefox` flag. You can also choose `phantomjs` and `safari`.

# Meteor Specific Features

## Hot-code reload watch mode
When Meteor is detected in the `--watch` mode, Chimp will connect to your app via DDP and watch for client/server updates. As soon as any are detected, Chimp will rerun the tests/specs that have the watched tags.

## Call a DDP Method
when the `--ddp` flag is passed, you get a global `server` object available in your tests/steps that allows you to call methods via DDP using this syntax:

```javascript
// using call
var result = server.call('fixtures/resetMyApp');

// or apply
var result = server.apply('myMethodWithArgs', [argsArray]);
```

Note: for Mocha `server` is defined with in the `it`,`before`,  `beforeEach`, `after` and  `afterEach` callbacks.  `server` is undefined in the `describe` callback.

These work just like they do on the Meteor server and they are synchronous.

You can define fixtures using [this method](http://guide.meteor.com/testing.html#creating-integration-test-data) and run `meteor` alongside Chimp using [this method](http://guide.meteor.com/testing.html#creating-acceptance-test-data).

## Execute Code in the Meteor Context
You can run code inside the Meteor context from your specs like this:

##### In the Server Context

```javascript
var getMeteorSettings = function (setting) {
  return Meteor.settings[setting]
};
var mySetting = server.execute(getMeteorSettings, 'mySetting');
console.log(mySetting);
```

The call is synchronous, can return complex objects and works both in Cucumber and Mocha.

## Meteor Utility Packages
In order for ```server.execute()``` to work, you need to install the[ xolvio:backdoor](https://atmospherejs.com/xolvio/backdoor) package.  We also recommend installing the [xolvio:cleaner](https://atmospherejs.com/xolvio/cleaner) package, which allows for resetting your Mongo test database.

##### In the Client Context
you can do this synchronously using WebdriverIO's [execute](http://webdriver.io/api/protocol/execute.html) 

```javascript
var getUserProfileProperty = function (property) {
  return Meteor.user().profile[property];
};
client.url('http://localhost:3000'); // the client must be on a Meteor app page
var userName = client.execute(getUserProfileProperty, 'name').value;
console.log(userName);
```

## Try out the example
See our [Automated Testing Best Practices](https://github.com/xolvio/automated-testing-best-practices) for examples of using Chimp. 

You may also be interested in the [tests/cucumber](https://github.com/xolvio/Letterpress/tree/master/app/tests/cucumber) directory of our dated - but still useful - Letterpress project.

## Learn Mocha, Cucumber & Chimp
Use the links on the right hand side to learn more about Chimp, Mocha, Cucumber and other libraries used in this package.


#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.