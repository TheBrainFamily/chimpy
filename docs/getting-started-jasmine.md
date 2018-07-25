| **[Home](/chimpy)** |

Follow the [Installation](/installation) instructions here.

# 1. Develop

To start developing using Jasmine, you have to start Chimp with the `--jasmine` flag like this:

```bash
chimpy --jasmine --watch
```

Chimpy will watch your features directory for any `.js` files and rerun any `describe`/`it` blocks  that contain the string `@watch`. For example:

```javascript
describe('Chimp Mocha', function() {
  describe('Page title', function () {
    it('should be set by the Meteor method @watch', function () {
      browser.url('http://www.google.com');
      expect(browser.getTitle()).to.equal('Google');
    });
  });
});
```

By default, Chimpy starts a Google Chrome browser window. This is where your specs will run and you can use this window to see the automation as it happens. Chimpy also ensures the same window will remain open between your specs rerunning so you won't get an annoying window popup. 

The watch mode is designed to keep you focused on the task at hand. The idea is you work on a scenario through to completion, and then move the `@watch` tag to the next spec you are working on.


# 2. Test

You've now finished your tasks and are ready to commit your code. If you want to run the build locally you can run all the tests using this command:

```bash
chimp --mocha --browser=firefox
```

Chimpy recognizes that you're not in watch mode and will run all the specs.

Notice how you can use a different browser. It's a good practice to develop using one browser and run all tests with another. 

This same command can also be used on CI servers.

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.
