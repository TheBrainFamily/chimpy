"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fiberizeJasmineApi;

var _underscore = _interopRequireDefault(require("underscore"));

var _fiberize = require("../utils/fiberize");

function fiberizeJasmineApi(context) {
  ['describe', 'xdescribe', 'fdescribe'].forEach(function (method) {
    var original = context[method];
    context[method] = _underscore["default"].wrap(original, function (fn) {
      var args = Array.prototype.slice.call(arguments, 1);

      if (_underscore["default"].isFunction(_underscore["default"].last(args))) {
        args.push((0, _fiberize.fiberizeSync)(args.pop()));
      }

      return fn.apply(this, args);
    });
  });
  ['it', 'xit', 'fit', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach(function (method) {
    var original = context[method];
    context[method] = _underscore["default"].wrap(original, function (fn) {
      var args = Array.prototype.slice.call(arguments, 1);

      if (_underscore["default"].isFunction(_underscore["default"].last(args))) {
        args.push((0, _fiberize.fiberize)(args.pop()));
      }

      return fn.apply(this, args);
    });
  });
}