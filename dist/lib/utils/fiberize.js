"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fiberize = fiberize;
exports.fiberizeSync = fiberizeSync;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _fibers = _interopRequireDefault(require("fibers"));

// Wrap a function in a fiber.
// Correctly handles expected presence of done callback
function fiberize(fn) {
  return function (done) {
    var self = this;
    (0, _fibers["default"])(function () {
      if (fn.length === 1) {
        fn.call(self, done);
      } else {
        var res = fn.call(self);

        if ((0, _typeof2["default"])(res) === 'object' && res !== null && typeof res.then === 'function') {
          res.then(function () {
            return done();
          })["catch"](done);
        } else {
          done();
        }
      }
    }).run();
  };
}

function fiberizeSync(fn) {
  return function () {
    var self = this;
    (0, _fibers["default"])(function () {
      fn.call(self);
    }).run();
  };
}