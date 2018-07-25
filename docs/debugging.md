| **[Home](/chimpy)** |

You can debug your Cucumber tests or Chimpy with the node debugger.

###[Debug Chimpy](#debug-chimpy)

###[Debug Your steps (Cucumber)](#debug-cucumber-your-steps)

###[Debug your specs (Mocha)](#debug-mocha-your-specs)

# Debug Chimpy

## 1. Add breakpoints

Use the `debugger;` statement in your code to create a breakpoint. You can place additional breakpoints later in the debugging session with the node-inspector user interface.


## 2. Start chimpy in debug mode

Start chimpy with node in debug mode.

```shell
node --debug --debug-brk `which chimpy`
# or for node 8.0
node --inspect --inspect-brk `which chimpy`
```

Wait until you see `debugger listening on port 5858` in the console.

## 3. Start node-inspector

Install node-inspector.

```shell
npm install node-inspector -g
```

Start node-inspector.

```shell
node-inspector
```

There will be two different debug sessions available.

**Chimpy:** [http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858](http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858)
**Cucumber** (and your tests): [http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5859](http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5859)

First you need to open the [Chimpy debug session](http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858). If you don't want to debug Chimpy itself, just press the resume button in the node-inspector user interface.

Wait until you see `debugger listening on port 5859` in the console. Now you can open the [Cucumber debug session](http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5859). After you have set your breakpoints, press the resume button and wait until a breakpoint hits.

Happy debugging!

# Debug Cucumber (Your Steps)

## 1. Add breakpoints

Use the `debugger;` statement in your code to create a breakpoints. You can place additional breakpoints later in the debugging session with the node-inspector user interface.


## 2. Tell Chimpy to start Cucumber in debug mode

You can use these command line switched to do that:

```shell
chimpy --debugCucumber
# or
chimpy --debugCucumber=<port>
```

To debug mode and break on start:

```shell
chimpy --debugBrkCucumber
# or
chimpy --debugBrkCucumber=<port>
```

You can then connect your favorite debugger and enjoy!

# Debug Mocha (Your Specs)

# 1. Add breakpoints

Use the `debugger;` statement in your code to create a breakpoints. You can place additional breakpoints later in the debugging session with the node-inspector user interface.


## 2. Tell Chimpy to start Mocha in debug mode

You can use these command line switched to do that:

```shell
chimpy --debugMocha
# or
chimpy --debugMocha=<port>
```

To use debug mode and break on start use:

```shell
chimpy --debugBrkMocha
# or
chimpy --debugBrkMocha=<port>
```

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpyRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.