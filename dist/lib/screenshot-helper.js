"use strict";

var booleanHelper = require('./boolean-helper');

var screenshotHelper = {
  shouldTakeScreenshot: function shouldTakeScreenshot(status) {
    return booleanHelper.isTruthy(process.env['chimp.captureAllStepScreenshots']) || status !== 'passed' && booleanHelper.isTruthy(process.env['chimp.screenshotsOnError']);
  },
  saveScreenshotsToDisk: function saveScreenshotsToDisk(fileName, projectDir) {
    if (global.browser.instances) {
      global.browser.instances.forEach(function (instance, index) {
        instance.captureSync(fileName + '_browser_' + index, projectDir);
      });
    } else {
      global.browser.captureSync(fileName, projectDir);
    }
  }
};
module.exports = screenshotHelper;