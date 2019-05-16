"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _fibers = _interopRequireDefault(require("fibers"));

var _underscore = _interopRequireDefault(require("underscore"));

var _environmentVariableParsers = require("../environment-variable-parsers");

var _escapeRegExp = _interopRequireDefault(require("../utils/escape-reg-exp"));

var _jasmineFiberizedApi = _interopRequireDefault(require("./jasmine-fiberized-api"));

var _screenshotHelper = _interopRequireDefault(require("../screenshot-helper"));

var _booleanHelper = _interopRequireDefault(require("../boolean-helper"));

require('../babel-register');

new _fibers["default"](function runJasmineInFiber() {
  var projectDir = process.env.PWD;
  var testsDir = process.env['chimp.path'];
  process.chdir(testsDir);

  var Jasmine = require('jasmine');

  var jasmine = new Jasmine(); // Capability to add multiple spec filters

  var specFilters = [];

  jasmine.env.specFilter = function shouldRunSpec(spec) {
    return _underscore["default"].every(specFilters, function (specFilter) {
      return specFilter(spec);
    });
  };

  jasmine.jasmine.addSpecFilter = function addSpecFilter(filterFn) {
    specFilters.push(filterFn);
  };

  if ((0, _environmentVariableParsers.parseBoolean)(process.env['chimp.watch'])) {
    // Only run specs with a watch tag in watch mode
    var watchedSpecRegExp = new RegExp((0, _environmentVariableParsers.parseString)(process.env['chimp.watchTags']).split(',').map(_escapeRegExp["default"]).join('|'));
    jasmine.jasmine.addSpecFilter(function (spec) {
      return watchedSpecRegExp.test(spec.getFullName());
    });
  } // Capability to capture screenshots


  jasmine.jasmine.getEnv().addReporter({
    specDone: function specDone(result) {
      if (_screenshotHelper["default"].shouldTakeScreenshot(result.status)) {
        if (_booleanHelper["default"].isTruthy(process.env['chimp.saveScreenshotsToDisk'])) {
          var affix = result.status !== 'passed' ? ' (failed)' : '';
          var fileName = result.fullName + affix;

          _screenshotHelper["default"].saveScreenshotsToDisk(fileName, projectDir);
        }
      }
    }
  });
  (0, _jasmineFiberizedApi["default"])(global);
  jasmine.loadConfig(getJasmineConfig());
  jasmine.configureDefaultReporter(JSON.parse(process.env['chimp.jasmineReporterConfig']));
  jasmine.execute();
}).run();

function getJasmineConfig() {
  var jasmineConfig = JSON.parse(process.env['chimp.jasmineConfig']);

  if (jasmineConfig.specDir) {
    if (!jasmineConfig.spec_dir) {
      jasmineConfig.spec_dir = jasmineConfig.specDir;
    }

    delete jasmineConfig.specDir;
  }

  if (jasmineConfig.specFiles) {
    if (!jasmineConfig.spec_files) {
      jasmineConfig.spec_files = jasmineConfig.specFiles;
    }

    delete jasmineConfig.specFiles;
  }

  if (!jasmineConfig.helpers) {
    jasmineConfig.helpers = [];
  }

  jasmineConfig.helpers.unshift(_path["default"].relative(jasmineConfig.spec_dir, _path["default"].resolve(__dirname, 'jasmine-helpers.js')));
  return jasmineConfig;
}