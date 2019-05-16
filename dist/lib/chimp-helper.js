"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _deepExtend = _interopRequireDefault(require("deep-extend"));

var _environmentVariableParsers = require("./environment-variable-parsers");

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    log = require('./log'),
    DDP = require('./ddp'),
    request = require('request'),
    Promise = require('bluebird'),
    _ = require('underscore'),
    wrapAsync = require('xolvio-sync-webdriverio').wrapAsync,
    wrapAsyncObject = require('xolvio-sync-webdriverio').wrapAsyncObject,
    SessionFactory = require('./session-factory'),
    path = require('path'),
    colors = require('colors'),
    fs = require('fs-extra'),
    exit = require('exit'),
    booleanHelper = require('./boolean-helper');

var chimpHelper = {
  loadAssertionLibrary: function loadAssertionLibrary() {
    if (booleanHelper.isTruthy(process.env['chimp.chai'])) {
      log.debug('[chimp][helper] Using the chai-expect assertion library');
      chai.use(chaiAsPromised);
      chai.should(); // give users access to the chai instance

      global.chai = chai;
      global.expect = chai.expect;
      global.assert = chai.assert;
    } else {
      log.debug('[chimp][helper] Using the jasmine-expect assertion library');
      global.expect = require('xolvio-jasmine-expect').expect;
    }
  },
  setupGlobals: function setupGlobals() {
    global.wrapAsync = wrapAsync;
    global.wrapAsyncObject = wrapAsyncObject; // give users access the request module

    global.request = request;

    _.extend(global, wrapAsyncObject(global, ['request'], {
      syncByDefault: booleanHelper.isTruthy(process.env['chimp.sync'])
    })); // Give the user access to Promise functions. E.g. Promise.all.


    global.Promise = Promise;

    if (booleanHelper.isTruthy(process.env['chimp.ddp0'])) {
      // add .instances[] property onto the DDP object. this way
      // global.server is usable, but so is server.instances[0] as an alias for when using multiple ddp servers
      global.ddp = new DDP(process.env['chimp.ddp0']).connect(); // add on instances t

      global.ddp.instances = [];

      for (var key in process.env) {
        if (key.indexOf('chimp.ddp') !== -1) {
          var index = key.match(/chimp.ddp(.*)/)[1];

          if (index) {
            global.ddp.instances.push(new DDP(process.env['chimp.ddp' + index]).connect());
          }
        }
      }
    }
  },
  createGlobalAliases: function createGlobalAliases() {
    global.driver = global.browser;
    global.client = global.browser;
    global.mirror = global.ddp;
    global.server = global.ddp;
  },
  setupBrowserAndDDP: function setupBrowserAndDDP() {
    var setupBrowser = function setupBrowser() {
      log.debug('[chimp][helper] getting browser');
      var webdriverioConfigOptions = JSON.parse(process.env['chimp.webdriverio']);
      var webdriverioOptions = (0, _deepExtend["default"])(webdriverioConfigOptions, {
        desiredCapabilities: {
          browserName: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.browser']),
          platform: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.platform']),
          name: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.name']),
          version: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.browserVersion']),
          deviceName: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.deviceName'])
        },
        user: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.user'] || process.env.SAUCE_USERNAME),
        key: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.key'] || process.env.SAUCE_ACCESS_KEY),
        host: (0, _environmentVariableParsers.parseNullableString)(process.env['chimp.host']),
        port: (0, _environmentVariableParsers.parseNullableInteger)(process.env['chimp.port']),
        logLevel: booleanHelper.isTruthy(process.env['chimp.debug']) ? 'verbose' : webdriverioConfigOptions.logLevel,
        sync: (0, _environmentVariableParsers.parseBoolean)(process.env['chimp.sync'])
      });
      global.sessionManager = new SessionFactory(Object.assign(_.pick(webdriverioOptions, 'host', 'port', 'user', 'key'), {
        browser: webdriverioOptions.desiredCapabilities.browserName,
        deviceName: webdriverioOptions.desiredCapabilities.deviceName
      }));

      if (booleanHelper.isTruthy(process.env['chimp.watch'])) {
        webdriverioOptions.desiredCapabilities.applicationCacheEnabled = false;
      }

      log.debug('[chimp][helper] webdriverioOptions are ', JSON.stringify(webdriverioOptions));
      var remoteSession;

      if ((0, _environmentVariableParsers.parseNullableInteger)(process.env['CUCUMBER_BROWSERS'])) {
        var options = _.clone(webdriverioOptions);

        options.multiBrowser = true;
        var multiremoteWebdriverIoOptions = {};

        var _browsersTotal = (0, _environmentVariableParsers.parseNullableInteger)(process.env['CUCUMBER_BROWSERS']);

        for (var _browserIndex = 0; _browserIndex < _browsersTotal; _browserIndex++) {
          multiremoteWebdriverIoOptions['browser' + _browserIndex] = _.clone(options);
        }

        remoteSession = wrapAsync(global.sessionManager.multiremote, global.sessionManager);
        global.browser = remoteSession(multiremoteWebdriverIoOptions);
      } else {
        remoteSession = wrapAsync(global.sessionManager.remote, global.sessionManager);
        global.browser = remoteSession(webdriverioOptions);
      }

      global.browser.options = webdriverioOptions;
      chaiAsPromised.transferPromiseness = global.browser.transferPromiseness;
    };

    var initSingleBrowser = function initSingleBrowser(browser) {
      log.debug('[chimp][helper] init browser');
      log.debug('[chimp][helper] init browser callback');
      browser.screenshotsCount = 0;
      browser.addCommand('capture', function (name, screenshotsPathPrefix) {
        var screenshotsCountForFileName = "".concat(browser.screenshotsCount++, "_");
        var fileName = name.replace(/[ \\~#%&*{}/:<>?|"-]/g, '_');
        var fileExtension = '.png';
        var suggestedFileNameLength = screenshotsCountForFileName.length + fileName.length + fileExtension.length;

        if (suggestedFileNameLength > 255) {
          var numberOfCharactersToLeave = fileName.length - (suggestedFileNameLength - 255);
          fileName = fileName.substr(0, numberOfCharactersToLeave);
        }

        var fullFileName = "".concat(screenshotsCountForFileName).concat(fileName).concat(fileExtension);
        var screenshotsPath = process.env['chimp.screenshotsPath'];

        if (screenshotsPathPrefix) {
          screenshotsPath = path.join(screenshotsPathPrefix, screenshotsPath);
        }

        fs.mkdirsSync(screenshotsPath);
        var ssPath = path.join(screenshotsPath, fullFileName);
        log.debug('[chimp][helper] saving screenshot to', ssPath);
        this.saveScreenshot(ssPath, false);
        log.debug('[chimp][helper] saved screenshot to', ssPath);
      });

      if (process.env['chimp.browser'] === 'phantomjs') {
        browser.setViewportSizeSync({
          width: process.env['chimp.phantom_w'] ? parseInt(process.env['chimp.phantom_w']) : 1280,
          height: process.env['chimp.phantom_h'] ? parseInt(process.env['chimp.phantom_h']) : 1024
        });
      }
    };

    var initBrowser = function initBrowser() {
      log.debug('[chimp][hooks] init browser');
      var browser = global.browser;
      log.debug('[chimp][hooks] init browser callback');

      if (browser.instances) {
        browser.instances.forEach(function (singleBrowser) {
          var desiredCapabilities = singleBrowser.initSync();
          singleBrowser.desiredCapabilities = desiredCapabilities;
          initSingleBrowser(singleBrowser);
        });
      } else {
        var desiredCapabilities = browser.initSync();
        browser.desiredCapabilities = desiredCapabilities;
        initSingleBrowser(browser);
      }
    };

    var addServerExecute = function addServerExecute(ddpInstance) {
      ddpInstance.execute = function (func) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result;
        var timeout = parseInt(process.env['chimp.serverExecuteTimeout']) || 10000;
        setTimeout(function () {
          if (!result) {
            throw new Error('[chimp] server.execute timeout after ' + timeout + 'ms');
          }
        }, timeout);

        try {
          result = ddpInstance.call('xolvio/backdoor', func.toString(), args);
        } catch (exception) {
          if (exception.error === 404) {
            throw new Error('[chimp] You need to install xolvio:backdoor in your meteor app before you can use server.execute()');
          } else {
            throw exception;
          }
        }

        if (result.error) {
          var error = new Error('Error in server.execute' + result.error.message);
          error.stack += '\n' + result.error.stack.replace(/ {4}at/g, '  @');
          throw error;
        } else {
          return result.value;
        }
      };
    };

    var setupDdp = function setupDdp() {
      log.debug('[chimp][helper] setup DDP');

      if (process.env['chimp.ddp0']) {
        try {
          log.debug('[chimp][helper] connecting via DDP to', process.env['chimp.ddp0']);
          global.ddp.connectSync();
          addServerExecute(global.ddp);

          for (var i = 0; i < global.ddp.instances.length; i++) {
            log.debug('[chimp][helper] connecting via DDP to ' + global.ddp.instances[i]._original.host + ':' + global.ddp.instances[i]._original.port);
            global.ddp.instances[i].connectSync();
            addServerExecute(global.ddp.instances[i]);
          }

          log.debug('[chimp][helper] connecting via DDP had no error');
        } catch (error) {
          var errorMessage = error;

          if (_.isObject(error)) {
            if (error.code === 'ECONNREFUSED') {
              log.error('[chimp][helper] Cannot connect to Meteor. Please check if your application is up and running on ' + error.address + ' port ' + error.port);
            }

            errorMessage = error.code;
          }

          log.error('[chimp][helper] connecting via DDP error', errorMessage);
          global.browser.endSync();
          process.exit(1);
        }
      } else {
        var noDdp = function noDdp() {
          expect('DDP Not Connected').to.equal('', 'You tried to use a DDP connection but it' + ' has not been configured. Be sure to pass --ddp=<host>');
        };

        global.ddp0 = {
          call: noDdp,
          apply: noDdp,
          execute: noDdp
        };
        log.debug('[chimp][helper] DDP not required');
      }
    };

    try {
      setupBrowser();
      initBrowser();

      if (booleanHelper.isTruthy(process.env['chimp.ddp0'])) {
        setupDdp();
      }
    } catch (error) {
      log.error('[chimp][helper] setupBrowserAndDDP had error');
      log.error(error);
      log.error(error.stack);
      exit(2);
    }
  },
  init: function init() {
    this.setupGlobals();
    this.createGlobalAliases();
  }
};
global.chimpHelper = chimpHelper;
module.exports = chimpHelper;