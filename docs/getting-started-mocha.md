| **[Home](/chimpy)** |

Follow the [Installation](installation) instructions here.

# 1. Develop

To start developing using Mocha, you have to start Chimp with the `--mocha` flag like this:

```bash
chimpy --mocha --watch
```

Chimpy will watch your feature directory for any `.js` files and rerun any `describe`/`it` blocks  that contain the string `@watch`. For example:

```javascript
describe('Chimp Jasmine', function() {
  describe('Page title', function () {
    it('should be set by the Meteor method @watch', function () {
      browser.url('http://www.google.com');
      expect(browser.getTitle()).toEqual('Google');
    });
  });
});
```

Make sure that your spec files end with "_spec", "-spec" or "Spec".

By default, Chimpy starts a Google Chrome browser window. This is where your specs will run and you can use this window to see the automation as it happens. Chimpy also ensures the same window will remain open between your specs rerunning so you won't get an annoying window popup. 

The watch mode is designed to keep you focused on the task at hand. The idea is you work on a scenario through to completion, and then move the `@watch` tag to the next spec you are working on.

# 2. Test

You've now finished your tasks and are ready to commit your code. If you want to run the build locally you can run all the tests using this command:

```bash
chimpy --jasmine
```

Chimpy recognizes that you're not in watch mode and will run all the specs.

This same command can also be used on CI servers.

# 3. Learn More

You can find more info on the [Jasmine support](/jasmine-support.md) page.


#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.