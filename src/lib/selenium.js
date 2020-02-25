const _ = require('underscore'),
  processHelper = require('./process-helper.js'),
  selenium = require('selenium-standalone'),
  booleanHelper = require('./boolean-helper'),
  log = require('./log');

class Selenium {
  /**
   * Selenium Constructor
   *
   * @param {Object} options
   * @api public
   */
  constructor(options) {
    if (!options) {
      throw new Error('options is required');
    }

    if (booleanHelper.isFalsey(options.port)) {
      throw new Error('options.port is required');
    }

    this.options = _.clone(options);

    this.seleniumStandaloneOptions = options.seleniumStandaloneOptions;

    if (!this.options['clean-selenium-server']) {
      // poor-man's singleton is enough for our needs
      if (typeof Selenium.instance === 'object') {
        log.debug('[chimp][selenium]', 'Selenium object already exists, not creating a new one');
        return Selenium.instance;
      }
      log.debug('[chimp][selenium]', 'Selenium object created');
      Selenium.instance = this;
    }

    this.options.port = String(options.port);
    this.child = null;
  }


  /**
   * Installs Selenium and drivers.
   *
   * @param {Function} callback
   * @api public
   */
  install = (callback) => {
    const ProgressBar = require('progress');
    let bar;
    let firstProgress = true;
    Selenium.installCallback = callback;

    if (this.options.offline) {
      log.debug('[chimp][selenium]', 'Offline mode enabled, Chimp will not attempt to install Selenium & Drivers');
      callback();
      return;
    }

    log.debug('[chimp][selenium]', 'Installing Selenium + drivers if needed');

    this.seleniumStandaloneOptions.progressCb = progressCb;

    selenium.install(this.seleniumStandaloneOptions, (e, r) => {
      if (e && e.message.match(/Error: getaddrinfo ENOTFOUND/)) {
        log.debug('[chimp][selenium]', e.message);
        log.info('[chimp][selenium] Detected a connection error in selenium-standalone. Are you offline?');
        log.info('[chimp][selenium] Consider using the --offline option to explicitly skip installing Selenium & drivers.');
        log.info('[chimp][selenium] Attempting to continue...');
        Selenium.installCallback(null, r);
      } else {
        Selenium.installCallback(e, r);
      }
    });

    function progressCb(total, progress, chunk) {
      if (firstProgress) {
        firstProgress = false;
      }

      bar = bar || new ProgressBar(
          'selenium-standalone installation [:bar] :percent :etas', {
            total,
            complete: '=',
            incomplete: ' ',
            width: 20,
          });

      bar.tick(chunk);
    }
  }

  /**
   * Start Selenium process.
   *
   * It also installs Selenium if necessary.
   *
   * @param {Function} callback
   * @api public
   */
  start = (callback) => {
    const self = this;
    const port = self.options.port;
    Selenium.startCallback = callback;

    log.debug('[chimp][selenium]', 'Start');

    if (self.child) {
      log.debug('[chimp][selenium]', 'Already running, doing nothing');
      callback(null);
      return;
    }

    self.install((error) => {
      if (error) {
        log.error('[selenium]', error);
        Selenium.startCallback(error);
        return;
      }

      if (!self.seleniumStandaloneOptions.seleniumArgs) {
        self.seleniumStandaloneOptions.seleniumArgs = [];
      }
      self.seleniumStandaloneOptions.seleniumArgs.push('-port', port);

      if (process.env['chimp.log'] === 'verbose' || process.env['chimp.log'] === 'debug') {
        self.options.seleniumDebug = true;
      }

      if (self.options.seleniumDebug) {
        self.seleniumStandaloneOptions.seleniumArgs.push('-debug');
      }

      log.debug(`\n[chimp][selenium] hub can be seen at http://localhost:${port}/wd/hub`);

      selenium.start(self.seleniumStandaloneOptions, (error, seleniumChild) => {
        self.child = seleniumChild;

        if (error) {
          Selenium.startCallback(error);
          return;
        }

        if (self.options.seleniumDebug) {
          processHelper.logOutputs('selenium', self.child);
        }

        process.on('exit', () => {
          log.debug('[chimp][selenium] process exit event detected. Stopping process');
          self.stop(() => {
            log.debug('[chimp][selenium] process exit event stop complete');
          });
        });

        Selenium.startCallback(null);
      });
    });
  }

  stop = (callback) => {
    const self = this;
    Selenium.stopCallback = callback;

    if (self.child) {
      log.debug('[chimp][selenium] killing active session');

      const options = {
        child: self.child,
        prefix: 'selenium',
        signal: 'SIGINT',
      };

      log.debug('[chimp][selenium] stopping process');
      processHelper.kill(options, (err, res) => {
        self.child = null;
        Selenium.stopCallback(err, res);
      });
    } else {
      log.debug('[chimp][selenium] no process to kill');
      Selenium.stopCallback(null);
    }
  }

  interrupt = (callback) => {
    log.debug('[chimp][selenium] interrupt called');
    if (!this.options.watch || !!this.options['clean-selenium-server']) {
      this.stop(callback);
    } else {
      log.debug('[chimp][selenium] interrupt is not killing selenium because ' +
          'clean-selenium-server not set');
      callback(null);
    }
  }
}

module.exports = Selenium;
