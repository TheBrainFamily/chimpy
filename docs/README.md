[![Circle CI](https://circleci.com/gh/TheBrain/chimpy.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/TheBrain/chimpy) [![npm Version](https://img.shields.io/npm/dm/chimpy.svg)](https://www.npmjs.com/package/chimpy) [![Code Climate](https://codeclimate.com/github/TheBrain/chimpy/badges/gpa.svg)](https://codeclimate.com/github/TheBrain/chimpy) [![License](https://img.shields.io/npm/l/chimpy.svg)](https://www.npmjs.com/package/chimpy)

[![Gitter](https://img.shields.io/gitter/room/xolvio/chimp.svg)](https://gitter.im/xolvio/chimp)  [![Slack Status](http://community.xolv.io/badge.svg)](http://community.xolv.io)


# IMPORTANT ANNOUNCEMENT - July 22nd, 2018

The Chimp that you know and love is now being split into two separate projects, both of which are intended to help you deliver higher quality faster.

The first is [*Chimpy*](https://github.com/TheBrainFamily/chimpy), which will be developed and maintained by [TheBrain team](http://team.thebrain.pro). This project will continue evolving and supporting the current thinking behind Chimp 1.x. 

The second is [*Chimp 2.0*](https://github.com/xolvio/chimp), which will be developed and maintained by [Xolv.io](http://xolv.io). This project will be built from scratch based on the learnings made while using Chimp 1.x in the field.

For more details about this decision, [please see the full announcement here.](TODO)

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