| **[Home](/chimpy)** |

## Prerequisite

If you would like to use Selenium, you need to have Java.
**Oracle JDK v1.8+** ([Download Here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html))
You can check your Java version in the terminal with `java -version` (single dash) 

Be sure to install the **JDK** not the JRE.

## Installation

```bash
npm install chimpy
```

and then you can run using `./node_modules/.bin/chimpy`

## Gulp Installation

TODO: This needs a patch since Chimpy has been forked from Chimp.

[gulp-chimpy](https://www.npmjs.com/package/gulp-chimpy) is a wrapper to interact with Chimp.js in a gulp task.

## Quick Install

In the terminal run the following command
```
npm install gulp-chimpy --save-dev
```

## Usage with chimp.conf.js file  [chimp.conf.js](https://github.com/eduardogch/gulp-chimp/blob/master/chimp.conf.js)

```
var chimp = require('gulp-chimp');

/* Chimp.js - Automated/e2e Testing with a config file */
gulp.task('chimpy', function () {
    return chimp('./chimp.conf.js');
});
```

## Cucumber HTML Report

![alt tag](https://github.com/eduardogch/gulp-chimp/raw/master/cucumber-html-report.png)

## Usage with chimp.js options

```
/* Chimp.js - Automated/e2e Testing with options */
gulp.task('chimp-options', function () {
    return chimp({
        path: './source/e2e/features', // Cucumber features files
        browser: 'phantomjs',
        debug: true,
        singleRun: false,
        log: 'info',
        timeout: 60000,
        port: 2345,
        reportHTML: true
    });
});
```

##### path

Type: `string`
Default: `./source/e2e/features`

##### browser

Type: `string`
Default `chrome`

##### singleRun

Type: `boolean`
Default `true`

##### debug

Type: `boolean`
Default `false`

##### log

Type: `string`
Default: `info`

##### timeout

Type: `number`
Default `60000`

##### port

Type: `number`
Default `2356`

##### reportHTML

Type: `boolean`
Default `true`


## Troubleshooting
**Permission Denied**
If you get this error message:
`Error: EACCES: permission denied, mkdir...`

Try deleting the .selenium directory using:
```bash
sudo rm -rf /usr/local/lib/node_modules/chimpy/node_modules/selenium-standalone/.selenium
```

**Failed at the fibers**
If you get this error message:
`npm ERR! Failed at the fibers@1.0.9 install script 'node build.js || nodejs build.js'.`

Upgrade to Node 4.x+


#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.