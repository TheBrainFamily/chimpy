| **[Home](/chimpy)** |

Chimpy and the integrated packages are all configurable through the command-line. Although Chimpy is somewhat opinionated, it tries to be as flexible as possible for advanced users. 

See the [default Chimpy configuration](https://github.com/xolvio/chimpy/blob/master/src/bin/default.js) file for the available options. You can provide any of the options in that file via the command-line also by prefixing the listed option with `--`.

```javascript
// Example configuration to use browser located into non standard path
module.exports = {
  seleniumStandaloneOptions: {
    seleniumArgs: [
     '-Dwebdriver.firefox.bin=/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin'
    ]
  }
}
```
## Using a Configuration File
If you would like to use a configuration file, you can simply place a `chimp.js` file in the directory that you run Chimpy from.

You can also name your configuration file, but be sure to include the word `chimpy` inside it, and pass it in as the first parameter after the test runner, for example:

```bash
chimpy config/chimp-ci.js 
```

#### Using Meteor?
If you are using Meteor, you will not be able to put the configuration file in the root directory of your project as Meteor will compile and run it, which results in a `module.exports` is not defined error.

You can get around Create a directory such as `.config` inside your Meteor directory and you can place a configuration file in there, like this:

```
<meteor app>
├── .config
    └── chimp.js
```

Then you can run Chimpy with:

```bash
chimpy .config/chimp.js
```

Be sure the config file is the first parameter you pass to Chimpy that the config filename contains the word `chimp`.

> **NOTE:** 
> *You need to pass arguments always with an equal sign like `--tags=@focus` to Chimp.*

For Cucumber pass-through options, see here:
* See [Cucumber.js CLI documentation](https://github.com/cucumber/cucumber-js#cli)
* See [Cucumber.js options source code](https://github.com/cucumber/cucumber-js/blob/v0.9.2/lib/cucumber/cli.js#L24-L43)

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.