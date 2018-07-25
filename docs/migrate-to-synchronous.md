| **[Home](/chimpy)** |

If you have any trouble with the migration, let us know via [GitHub issue](https://github.com/TheBrainFamily/chimpy/issues)

# 1. Start Chimpy with "--sync=false"

Start chimpy with `chimpy --sync=false --watch` (add your other options).

This is you step definition before the migration:

```javascript
// Promise Style:
this.When(/^I visit "([^"]*)"$/, function (url) {
  return client.url(url);
});
```

```javascript
// Callback Style:
this.When(/^I visit "([^"]*)"$/, function (url, callback) {
  browser.url(url).call(callback);
});
```

# 2. Migrate all step definitions to synchronous style one by one

Use the WebDriver.io commands with the Sync postfix until you have migrated all step definitions to the synchronous style. This way you continuously get feedback from Cucumber if you make any migration errors.

```javascript
this.When(/^I visit "([^"]*)"$/, function (url) {
  client.urlSync(url);
});
```

We removed the callback parameter, no longer return anything and use `urlSync`.

# 3. Remove all Sync postfixes

After you have migrated all step definitions to the synchronous style, you can remove all Sync postfixes.

Use search and replace with a regular expression. Search for `(?:this\.)?((?:browser|client|driver|server|ddp)\.\w+)Sync` and replace it with `$1`. It removes also the `this.` prefix.

```javascript
this.When(/^I visit "([^"]*)"$/, function (url) {
  client.url(url);
});
```

# 4. Start Chimpy without "--sync=false"

Finally, start Chimp without `--sync=false` (the default is true).

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.