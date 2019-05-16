"use strict";

var chimpHelper = require('../chimp-helper');

var exit = require('exit');

var log = require('../log');

var booleanHelper = require('../boolean-helper');

var screenshotHelper = require('../screenshot-helper');

before(function () {
  process.env['chimp.chai'] = true;
  chimpHelper.loadAssertionLibrary();
  chimpHelper.init();
  chimpHelper.setupBrowserAndDDP();
});
after(function () {
  if (process.env['chimp.browser'] !== 'phantomjs') {
    log.debug('[chimp][mocha-helper] Ending browser session');
    global.wrapAsync(global.sessionManager.killCurrentSession, global.sessionManager)();
    log.debug('[chimp][mocha-helper] Ended browser sessions');
  }
});
afterEach(function () {
  if (screenshotHelper.shouldTakeScreenshot(this.currentTest.state)) {
    if (booleanHelper.isTruthy(process.env['chimp.saveScreenshotsToDisk'])) {
      var affix = this.currentTest.state !== 'passed' ? ' (failed)' : '';
      var fileName = this.currentTest.fullTitle() + affix;
      screenshotHelper.saveScreenshotsToDisk(fileName);
    }
  }
});