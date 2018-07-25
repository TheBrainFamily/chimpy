| **[Home](/chimpy)** |

With Chimpy you can write your tests in a synchronous style. So you don't have to deal with confusing promise chains or callback hell.

All the APIs that are shipped with Chimp can be used in a synchronous style by default. This includes the WebdriverIO commands, request module, and the DDP client.

## Making asynchronous functions synchronous

If you have asynchronous functions that you want to use in your tests, you can wrap them with our helper functions `wrapAsync` and `wrapAsyncObject`. Both helpers work with asynchronous functions that return a promise or use a callback.

* **wrapAsync(fn: Function, [context: Object]): Function**
  Takes the asynchronous function as first argument and optional the function context (the value of `this` inside the function). It returns a synchronous version of the asynchronous function.

* **wrapAsyncObject(object: Object, properties: Array, [options: Object]): Object**
  Creates synchronous versions of the asynchronous methods of an object. It returns the wrapper object with the synchronous and asynchronous methods.The first argument is the object. The second argument is an array of the method names that should be made synchronous.

### Example

You have an object `myObject` with an asynchronous method `myFunc`:

```javascript
var myObject = {
  myFunc: function (callback) { ... }  // Asynchronous function
}
```

You wrap it with `wrapAsyncObject`:

```javascript
var myObjectWrapper = wrapAsyncObject(myObject, ['myFunc'])
```

`myObjectWrapper` is:

```javascript
myObjectWrapper = {
  myFunc: function () { ... } // Synchronous version
  myFuncSync: function () { ... } // Synchronous version
  myFuncAsync: function (callback) { ... } // Asynchronous version
}
```

myObject has not changed.

### options

* **syncByDefault: Boolean (default: true)**

If you set this to `false`, you get this result instead:

```javascript
myObjectWrapper = {
  myFunc: function (callback) { ... } // Asynchronous version
  myFuncSync: function () { ... } // Synchronous version
  myFuncAsync: function (callback) { ... } // Asynchronous version
}
```

`myFunc` is asynchronous.

* **wrapAsync: Function (default: wrapAsync)**

If you want to use another function to wrap the asynchronous methods, you could pass it with this option.

#### *Want to become a testing Ninja?*

Checkout Xolv.io's new [Quality Faster](https://www.qualityfaster.com/?utm_source=XolvOSS&utm_medium=OSSDocs&utm_content=ChimpRM-Home&utm_campaign=QFLaunch) guide where you can learn how to can bake quality in across the full stack using React, Node.JS, Jest, Meteor and more.