| **[Home](/chimpy)** |

Follow the [Installation](/installation) instructions here.

# 1. Develop

Chimpy assumes you have a folder called `./features` in the directory you run it from where your CucumberJS feature and support files reside. If you don't have any feature files or don't know what that is, please see the [Key Concepts section](doc:key-concepts) below and then run through the [tutorial](doc:tutorial) to get up to speed.

```bash
chimpy --watch
```

Chimpy will watch your feature & supporting files directory and rerun any features/scenarios that have the tag `@watch`.

By default, Chimp starts a Google Chrome browser window. This is where your specs will run and you can use this window to see the automation as it happens. Chimp also ensures the same window will remain open between your specs rerunning so you won't get an annoying window popup. 

The watch mode is designed to keep you focused on the task at hand. The idea is you work on a scenario through to completion, and then move the `@watch` tag to the next scenario.


# 2. Test

You've now finished your tasks and are ready to commit your code. If you want to run the build locally you can run all the tests using this command:

```bash
chimpy --browser=firefox
```

Chimpy recognizes that you're not in watch mode and will run all specs, except those with the 
`@ignore` tag.

Notice how you can use a different browser. It's a good practice to develop using one browser and run all tests with another. 

This same command can also be used on CI servers. You can tell Chimp to output the CucumberJS report to a JSON file like this:

```bash
chimpy --jsonOutput=cucumber_output.json
```

This is a good build artifact to keep for traceability, especially on CircleCI where these files are natively supported.

#### *Need Help?*
Contact us the maintainers of Chimpy. The Brain [offers testing consulting and training services](TODO) that can help you speed up your development and improve the quality of your products and services. 

#### *Want to learn more?*
Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.