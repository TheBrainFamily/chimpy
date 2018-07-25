| **[Home](/chimpy)** |

Chimpy supports the latest version of Jasmine. Currently this is version 2.4.x.

You can enable Jasmine support by starting Chimpy with with `--jasmine` flag or setting `jasmine: true` in your Chimpy config file.

Additionally the Chimpy config file supports the [following Jasmine options](https://github.com/TheBrainFamily/chimpy/blob/master/src/bin/default.js#L120-L136). The values in this file are the defaults. You can read more about those options in the [Jasmine documentation](http://jasmine.github.io/2.4/node.html).

Additionally by default:
* Spec file names need to end with "_spec.js", "-spec.js" or "Spec.js".
* Files in the support/ folder will run before the tests.
* You can use ES2015 out of the box.

If you miss any information or something is unclear please [open an issue](https://github.com/xolvio/chimp/issues/new).

### Custom spec filter

Add a helper file with something like for example:

```javascript
const smokeTestRegExp = /@smoke/;
jasmine.addSpecFilter(function (spec) {
  return smokeTestRegExp.test(spec.getFullName());
});
```