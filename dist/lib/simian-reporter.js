"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _request = _interopRequireDefault(require("request"));

var _log = _interopRequireDefault(require("./log"));

/**
 * SimianReporter Constructor
 *
 * @param {Object} options
 * @api public
 */
function SimianReporter(options) {
  this.options = options; // FIXME: We need a way to isolate instance in jest tests, until then this allows asserions

  SimianReporter.instance = this;
}

SimianReporter.prototype.report = function report(jsonCucumberResult, callback) {
  var query = {
    accessToken: this.options.simianAccessToken
  };

  if (this.options.simianRepositoryId) {
    query.repositoryId = this.options.simianRepositoryId;
  }

  var url = require('url').format({
    protocol: 'http',
    host: this.options.simianResultEndPoint,
    query: query
  });

  var data = {
    type: 'cucumber',
    branch: this.options.simianResultBranch,
    result: jsonCucumberResult
  };

  if (this.options.simianBuildNumber) {
    data.buildNumber = parseInt(this.options.simianBuildNumber, 10);
  }

  _request["default"].post({
    url: url,
    json: true,
    body: data
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      _log["default"].debug('[chimp][simian-reporter]', 'received data', body);
    } else {
      if (body) {
        _log["default"].error('[chimp][simian-reporter] Error from Simian:', body.error);
      } else {
        _log["default"].error('[chimp][simian-reporter]', 'Error while sending result to Simian:', error);
      }
    }

    callback(error);
  });
};

module.exports = SimianReporter;