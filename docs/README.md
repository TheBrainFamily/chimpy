<!-- [![Circle CI](https://circleci.com/gh/TheBrainFamily/chimpy.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/TheBrainFamily/chimpy) -->
[![npm Version](https://img.shields.io/npm/dm/chimpy.svg)](https://www.npmjs.com/package/chimpy) [![Code Climate](https://codeclimate.com/github/TheBrainFamily/chimpy/badges/gpa.svg)](https://codeclimate.com/github/TheBrainFamily/chimpy) [![License](https://img.shields.io/npm/l/chimpy.svg)](https://www.npmjs.com/package/chimpy)

[![Slack Status](http://community.xolv.io/badge.svg)](http://community.xolv.io)

---

# IMPORTANT ANNOUNCEMENT - July 22nd, 2018

The Chimp that you know and love is now being split into two separate projects, both of which are intended to help you deliver higher quality faster.

The first is [*Chimpy*](https://github.com/TheBrainFamily/chimpy), which will be developed and maintained by [TheBrain team](http://team.thebrain.pro). This project will continue evolving and supporting the current thinking behind Chimp 1.x. 

The second is [*Chimp 2.0*](https://github.com/xolvio/chimp), which will be developed and maintained by [Xolv.io](http://xolv.io). This project will be built from scratch based on the learnings made while using Chimp 1.x in the field.

For more details about this decision, [please see the full announcement here.](TODO)

---

| Documentation | |
|:--- | :--- |
| **[Installation](installation)** | **[Configuration](configuration)** | 
| **[Chimp + Cucumber](getting-started-cucumber)** | **[Reporting](reporting)** | 
| **[Chimp + Mocha](getting-started-mocha)** | **[Debugging](debugging)** |
| **[Chimp + Jasmine](getting-started-jasmine)** | **[Jasmine Support](jasmine-support)** |
| **[Chimp + Meteor](chimp-meteor)** | **[Multi Browser Testing](multi-browser-testing)** |
| **[Synchronous Tests](synchronous-tests)** | **[Migrate To Synchronous](migrate-to-synchronous)** |    
 **[Cloud Services](cloud-services)** | **[Cheatsheet](cheat-sheet)** | 
| **[Further Reading](further-reading)** | **[Credits](credits)** | 

---

An awesome developer-centric experience to writing tests with **realtime feedback** using Mocha, Jasmine or Cucumber.js.

![Chimpy by The Brain](./images/header.png?raw=true)

Chimpy can be used with *any technology stack* as it allows your to write your test automation in the language of the web: JavaScript.

### Realtime feedback?
Traditionally only available for unit testing, and now you can get super fast feedback for your acceptance and end-to-end tests:

![Realtime feedback](./images/realtime.gif?raw=true) 

Set an `@focus` tag in the spec title, save a file, Chimpy reruns the spec until you make it pass. 

### Installation as cli

```sh
npm install chimpy
```

Having trouble? See the [installation documentation](TODO).

### Usage as cli

For development mode, you can use the watch mode:
```sh
./node_modules/.bin/chimpy --watch
```
You can also easily change the browser Chimpy with `--browser`, e.g. `--browser=chrome`

## Additional Features

###### Synchronous Javascript
[![WebdriverIO](./images/wdio.png?raw=true)](http://webdriver.io/)

We chose [WebdriverIO](http://webdriver.io) for it's awesome API and made it awesomer by converting it to a synchronous syntax: 

```javascript
browser.url('http://google.com'); // SETUP

var title = browser.getTitle();   // EXECUTE

expect(title).to.equal('Google'); // VERIFY
```

No callback-hell or confusing assertions with promises, just easy-to-read synchronous code that works as you expect it to.

###### Easy CI
![CI](./images/ci.png?raw=true)

Chimpy is tested on all the popular CI servers. We genuinely just want you to focus on writing tests and let us deal with all the boring bits!

###### Mocha, Jasmine or Cucumber.js
![Test Frameworks](./images/test-frameworks.png?raw=true)

Some developers love Jasmine and Mocha, and some teams love to use Cucumber for BDD. We decided to give you the choice between the best in class test frameworks for writing end-to-end and acceptance tests. 

###### Client & Server

End-to-end and acceptance testing often require you to setup data on the server and reset state between specs. 

Chimpy exposes a global function called `request` that is a synchronous version of the popular [request module](https://www.npmjs.com/package/request#request-options-callback). Our synchronous version of the request module allows you to call your server to reset your system or setup data and receive a result back synchronously, like this:

```javascript
var userId = request({
  url: 'http://localhost:3000/fixtures/createUser'
  method: 'POST',
  json: true,
  body: {username: 'Bob', password: 't0ps3cret'}
});
```

Or if you are using Meteor, you can get fancy with our `server.execute` method:

```javascript
var privateSetting = server.execute(function(settingKey) {
  return Meteor.settings[settingKey];
}, 'privateSetting')
```

###### Lots more
Chimpy is PACKED with features that make your life easier. See the [documentation site](http://chimp.readme.io/docs) for more details.

## Using Meteor?

Chimpy comes with first-grade Meteor support out-of-the-box, including hot-deploy detection that runs specs after your Meteor client or server restart. 

Be sure to checkout our [Automated Testing Best Practices](https://github.com/xolvio/automated-testing-best-practices) repository which is written using Meteor.

### Usage

In development mode, use the watch mode:
```sh
# start your Meteor app first
chimpy --watch --ddp=http://localhost:3000
```

On CI, can select the browser:
```sh
# start your Meteor app first
chimpy --browser=firefox --ddp=http://localhost:3000
```

#### Multiple Meteor Servers
If you'd like to run a test with more than one Meteor app server, you can do so by running the same app on multiple ports and providing mulitple `-ddp` options to chimp:
```
# start first app
meteor --port 3005

# start second app in another shell 
meteor --port 3007

# run chimpy in another shell
chimpy --watch --ddp=http://localhost:3005 --ddp=http://localhost:3007
```
Then you can access the servers in your tests on the global `server.instances` property
```
it('has PORT env var set', function() {
  function getRootUrl() {
    return process.env.ROOT_URL;
  }
  expect(server.instances[0].execute(getRootUrl)).to.equal('http://localhost:3005/');
  expect(server.instances[1].execute(getRootUrl)).to.equal('http://localhost:3007/');
});
```

## Community
**Slack:** Join our Slack [xolv.io/community](http://community.xolv.io) #chimpy channel, where you can find help and help others.










# ABOUT 
Chimpy makes it super easy for developers to write automated tests, by taking away all the pain associated with setting up tools and allowing developers to focus on building-in quality.
 
It does so by integrating and sprinkling magic over the following tools:

* **[Mocha](https://mochajs.org)**, **[Jasmine](http://jasmine.github.io/edge/introduction.html)** or **[Cucumber.js](https://github.com/cucumber/cucumber-js)**
* **[Selenium](http://www.seleniumhq.org/)** and **[WebdriverIO](http://webdriver.io/)** 
* **[Chai](http://chaijs.com)** or **[Jasmine assertion](http://jasmine.github.io/edge/introduction.html#section-Expectations)** libraries inside your steps
* Built in Node.js, works for any web application *(with special **[Meteor](http://www.meteor.com)** support)*

### **Use what you are comfortable with** 
You can use  **[Mocha](https://mochajs.org)**, **[Jasmine](http://jasmine.github.io/edge/introduction.html)** or **[Cucumber.js](https://github.com/cucumber/cucumber-js)** to write your acceptance / end-to-end tests.

### **Test using Javascript - The language of the web**
Built in Node.js, works with any platform. If you're building a web application, Chimpy can add quality.

### **A unique watch mode** 
Reruns only the specs you tag, allowing you to stay hyper-focused on the feature you're working on.

### **Write your step definitions in a synchronous style** 
Tests don't need to be complicated! No more callback hell or confusing promise chains. Just write easy to read, clean code.

### **First-class Meteor.js Support** 
When used with **[Meteor](https://www.meteor.com)**, Chimpy is aware of Meteor's hot-code pushes and also allows you to run code within the client or server, allowing you to test deep within the Meteor context.

### **Full Continuous Integration Support**
Tested on **[Travis](https://travis-ci.com)**, **[CircleCI](https://circleci.com)**, **[CodeShip](https://codeship.com)** and of course **[Jenkins](https://jenkins-ci.org/)**.

### **Automatically Downloads & Configures Dependencies**
Like **[Selenium](http://www.seleniumhq.org/)** / **[ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/)** / **[IEDriver](https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver)** / **[PhantomJS](http://phantomjs.org/)**.

### **OSX, Linux and Windows**
Works on all these platforms.

### **Mobile Testing Support**
Using **[Appium](http://appium.io)**. You can even connect to real cloud devices services like the **[Amazon Device Farm](https://aws.amazon.com/device-farm/)**

### **Run your tests in the cloud**
**[SauceLabs](https://saucelabs.com)** / **[BrowserStack](https://www.browserstack.com)** support out the box.

### **Intelligently Reuses Browser Sessions**
Tests re-run fast, and you don't get annoying window-flicker whilst running your specs.

### **Automatically Takes Screenshots on Failures**
This happens automatically on CI servers when a step fails so you can track down errors. Can save them to file or include them in the JSON report as embedded images for easy artifact publishing and reporting. (Cucumber.js only for now, Mocha / Jasmine coming soon).


#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.