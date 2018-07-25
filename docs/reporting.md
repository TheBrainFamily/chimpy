| **[Home](/chimpy)** |

With Chimpy you can specify the reporter used to generate test results in each of the integrated frameworks.

### Mocha

If you are using Mocha, you can set the ```mochaReporter``` option in your chimp configuration to any of the official reporters listed [here](https://mochajs.org/#reporters) or one that you have installed from NPM.

From the command line:

```bash
chimpy --mocha --mochaReporter="nyan"
```

Or from your configuration file:

```json
{
  mocha: true,
  mochaReporter: "progress"
}
```

Due to some limitations in the Mocha framework, you are only able to use one reporter per test run. One workaround for this is to combine reporters, take a look at an example of this [here](https://github.com/sandcastle/mocha-circleci-reporter).

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.