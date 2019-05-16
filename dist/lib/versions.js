"use strict";

var _ = require('underscore'),
    fs = require('fs'),
    os = require('os'),
    log = require('./log'),
    async = require('async'),
    request = require('request'),
    spawnSync = require('child_process').spawnSync,
    selenium = require('selenium-standalone'),
    chromedriver = require('chromedriver'),
    booleanHelper = require('./boolean-helper'),
    processHelper = require('./process-helper.js');

function Versions(options) {
  var _this = this;

  this.options = options;
  this.appDir = '../..';
  this.chromeDriverExec = chromedriver.path;

  this.show = function (callback) {
    console.log('Chimp version: ', _this.getChimpVersion());
    console.log('ChromeDriver version: ', _this.getChromeDriverVersion());
    console.log('Java version: ', _this.getJavaVersion());
    console.log('Selenium version: ', _this.getSeleniumVersion());
    console.log('Selenium drivers version: ', _this.getSeleniumDriversVersion());
    console.log('OS version: ', _this.getOsVersion());
    console.log('Node version: ', _this.getNodeVersion());

    _this.getCurrentBrowserVersion(function (browserVersion) {
      var currentBrowser = _this.options.browser || 'chrome';
      console.log('Browser version: ', currentBrowser, browserVersion);

      if (callback) {
        callback();
      }
    });
  };

  this.getChimpVersion = function () {
    var packageJson = require("".concat(_this.appDir, "/package.json"));

    return packageJson.version;
  };

  this.getChromeDriverVersion = function () {
    if (booleanHelper.isFalsey(_this.options.host)) {
      if (booleanHelper.isTruthy(_this.options.browser)) {
        return 'Unknown. Chromedriver not used directly.';
      } else {
        return _this._spawnSync("".concat(_this.chromeDriverExec, " -v"));
      }
    } else {
      return 'Unknown. Selenium host provided.';
    }
  };

  this.getJavaVersion = function () {
    return _this._spawnSync('java -version');
  };

  this.getSeleniumVersion = function () {
    if (_this.options.seleniumStandaloneOptions) {
      return _this.options.seleniumStandaloneOptions.version;
    }

    return "Unknown.";
  };

  this.getSeleniumDriversVersion = function () {
    if (_this.options.seleniumStandaloneOptions) {
      var driversVersion = [];
      var drivers = _this.options.seleniumStandaloneOptions.drivers;

      _.each(_.keys(drivers), function (driverName) {
        driversVersion.push("".concat(driverName, ": ").concat(drivers[driverName].version));
      });

      return driversVersion.toString().replace(/,/g, ', ');
    }

    return "Unknown.";
  };

  this.getOsVersion = function () {
    return "".concat(os.type(), " ").concat(os.release());
  };

  this.getNodeVersion = function () {
    return process.version;
  };

  this.getCurrentBrowserVersion = function (callback) {
    if (booleanHelper.isTruthy(_this.options.browser)) {
      var seleniumOptions = _.clone(_this.options.seleniumStandaloneOptions);

      seleniumOptions.port = 1;
      async.series([function (cb) {
        selenium.install(seleniumOptions, function (err, seleniumInstallPaths) {
          cb(err, seleniumInstallPaths);
        });
      }], function (err, seleniumInstallPaths) {
        var selectedBrowserDriver = seleniumInstallPaths[0][_this.options.browser];

        if (selectedBrowserDriver) {
          var startBrowserOptions = {
            path: selectedBrowserDriver.installPath,
            port: _this.options.port
          };

          _this._startBrowserDriver(startBrowserOptions, function () {
            _this._getBrowserVersion(startBrowserOptions, function (err, browserVersion) {
              _this._stopBrowserDriver(function (err) {
                if (err) {
                  log.warn(err);
                }

                callback(browserVersion);
              });
            });
          });
        } else {
          callback("Driver for selected browser(".concat(_this.options.browser, ") not found."));
        }
      });
    } else {
      if (fs.existsSync(_this.chromeDriverExec)) {
        var startBrowserOptions = {
          path: _this.chromeDriverExec,
          port: _this.options.port
        };

        _this._startBrowserDriver(startBrowserOptions, function () {
          _this._getBrowserVersion(startBrowserOptions, function (err, browserVersion) {
            _this._stopBrowserDriver(function (err) {
              if (err) {
                log.warn(err);
              }

              callback(browserVersion);
            });
          });
        });
      } else {
        callback("Driver for selected browser not found.");
      }
    }
  }; // -------------------------------------------------------------------------------------


  this._startBrowserDriver = function (options, callback) {
    var waitMessage = new RegExp("".concat(options.port));
    _this.child = processHelper.start({
      bin: options.path,
      prefix: 'browserdriver',
      args: ['--port=' + options.port],
      waitForMessage: waitMessage,
      errorMessage: /Error/
    }, callback);
  };

  this._getBrowserVersion = function (options, callback) {
    var url = "http://localhost:".concat(options.port, "/session");
    var data = {
      "desiredCapabilities": {}
    };
    request.post({
      url: url,
      json: true,
      body: data
    }, function (error, response, body) {
      var data = {};

      if (!error && response.statusCode === 200) {
        data.sessionId = body.sessionId;
        data.browserVersion = body.value.version;
        request["delete"]("".concat(url, "/").concat(data.sessionId), function () {
          callback(null, data.browserVersion);
        });
      } else {
        error = 'Error connecting to browser driver.';
        callback(error);
      }
    });
  };

  this._stopBrowserDriver = function (callback) {
    if (_this.child) {
      var _options = {
        child: _this.child,
        prefix: 'browserdriver'
      };
      processHelper.kill(_options, function (err, res) {
        _this.child = null;
        callback(err, res);
      });
    } else {
      callback(null);
    }
  };

  this._spawnSync = function (commandToRun) {
    var endLine = new RegExp("".concat(os.EOL), 'g');
    var commandOptions = commandToRun.split(' ');
    var command = commandOptions.shift();
    var commandResult = spawnSync(command, commandOptions);

    if (commandResult.status !== 0 && commandResult.error) {
      if (commandResult.error.code === 'ENOENT') {
        return 'No such file or directory';
      } else {
        return "Error ".concat(commandResult.error.code);
      }
    } else {
      var commandToReturn = '';

      _.each(commandResult.output, function (output) {
        if (output && output.length) {
          commandToReturn += output.toString().trim();
        }
      });

      return commandToReturn.replace(endLine, ', ');
    }
  };
}

module.exports = Versions;