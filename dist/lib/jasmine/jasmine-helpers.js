"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chimpHelper = _interopRequireDefault(require("../chimp-helper"));

var _log = _interopRequireDefault(require("../log"));

beforeAll(function chimpSetup() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  _chimpHelper["default"].init();

  _chimpHelper["default"].setupBrowserAndDDP();
});
afterAll(function chimpTeardown() {
  if (process.env['chimp.browser'] !== 'phantomjs') {
    _log["default"].debug('[chimp][jasmine-helpers] Ending browser session');

    global.wrapAsync(global.sessionManager.killCurrentSession, global.sessionManager)();

    _log["default"].debug('[chimp][jasmine-helpers] Ended browser sessions');
  }
});