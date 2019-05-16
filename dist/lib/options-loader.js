"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _deepExtend = _interopRequireDefault(require("deep-extend"));

var path = require('path');

var fs = require('fs');

var log = require('./log');

module.exports = {
  getOptions: function getOptions() {
    var userOptionsFile;

    var processArgv = this._getProcessArgv();

    if (processArgv[2] && processArgv[2].match(/.*chimp.*\.js$/)) {
      userOptionsFile = path.resolve(process.cwd(), processArgv[2]);
      processArgv.splice(2, 1);

      if (!fs.existsSync(userOptionsFile)) {
        log.error(('[chimp] Could not find ' + processArgv[2]).red);

        this._exit(1);
      }
    } else {
      userOptionsFile = path.resolve(process.cwd(), 'chimp.js');
    }

    var userOptions = {};

    if (fs.existsSync(userOptionsFile)) {
      userOptions = this._requireFile(userOptionsFile);
      log.debug('[chimp] loaded', userOptionsFile);
    }

    var defaultOptions = this._requireFile(this._getDefaultConfigFilePath());

    var options = (0, _deepExtend["default"])(defaultOptions, userOptions);
    log.debug('[chimp] Chimp options are', options);
    return options;
  },
  _requireFile: function _requireFile(file) {
    return require(file);
  },
  _getProcessArgv: function _getProcessArgv() {
    return process.argv;
  },
  _exit: function _exit(code) {
    process.exit(code);
  },
  _getDefaultConfigFilePath: function _getDefaultConfigFilePath() {
    return path.resolve(__dirname, '..', 'bin', 'default.js');
  }
};