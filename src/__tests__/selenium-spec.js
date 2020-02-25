/* eslint-disable global-require */
jest.dontMock('../lib/selenium');
jest.dontMock('../lib/boolean-helper');
jest.dontMock('underscore');

describe('Selenium', () => {
  describe('constructor', () => {
    it('throws when options is not passed', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const createSelenium = function () {
        const tmp = new Selenium();
      };

      expect(createSelenium).toThrowError('options is required');
    });

    it('throws when options.port is not passed', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const options = {};
      const createSelenium = function () {
        const tmp = new Selenium(options);
      };

      expect(createSelenium).toThrowError('options.port is required');
    });

    it('converts options.port to a string', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;

      const selenium = new Selenium({port: 4444});

      expect(selenium.options.port).toBe('4444');
    });

    it('does not modify original options', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;

      const originalOptions = {
        port: 4444,
        someVar: 1234,
      };
      const selenium = new Selenium(originalOptions);
      originalOptions.someVar = 5678;

      expect(selenium.options.someVar).toBe(1234);
    });

    it('creates a singleton by default', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;

      const selenium = new Selenium({port: 4444});

      const selenium2 = new Selenium({port: 5678});

      expect(selenium).toBe(selenium2);
    });

    it('does not create a singleton when --clean-selenium-server is true', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;

      const selenium = new Selenium({port: '4444', 'clean-selenium-server': true});

      const selenium2 = new Selenium({port: 5678});

      expect(selenium).not.toBe(selenium2);
    });
  });

  describe('install', () => {
    it('installs selenium', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
      });
      const seleniumStandalone = require('selenium-standalone');

      selenium.install();

      expect(seleniumStandalone.install).toBeCalled();
    });

    it('passes callback to selenium-standalone call', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
        'clean-selenium-server': true,
      });
      const seleniumStandalone = require('selenium-standalone');
      const callback = jest.fn(() => {});

      selenium.install(callback);
      seleniumStandalone.install.mock.calls[0][1]();

      expect(callback).toBeCalled();
    });

    it('does not run if chimp is offline mode', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({port: '4444', offline: true});
      const seleniumStandalone = require('selenium-standalone');

      const callback = jest.fn();
      seleniumStandalone.install = jest.fn();
      selenium.install(callback);

      expect(seleniumStandalone.install.mock.calls.length).toBe(0);
      expect(callback.mock.calls.length).toBe(1);
    });
  });

  describe('start', () => {
    it('uses options.port to start selenium', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const port = '4444';
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
      });
      const seleniumStandalone = require('selenium-standalone');
      selenium.install = jest.fn();
      selenium.install.mockImplementation((callback) => {
        callback(null);
      });

      const callback = function () {};
      selenium.start(callback);

      expect(seleniumStandalone.start.mock.calls[0][0].seleniumArgs).toEqual(['-port', port]);
    });

    it('retains pre-existing options.seleniumArgs when starting selenium', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const port = '4444';
      const opt = '-some-option=True';
      const selenium = new Selenium({
        port,
        seleniumStandaloneOptions: {seleniumArgs: [opt]},
      });
      const seleniumStandalone = require('selenium-standalone');
      selenium.install = jest.fn();
      seleniumStandalone.start = jest.fn();
      selenium.install.mockImplementation((callback) => {
        callback(null);
      });

      const callback = function () {};
      selenium.start(callback);

      expect(seleniumStandalone.start.mock.calls[0][0].seleniumArgs).toEqual([opt, '-port', port]);
    });

    it('sets this.child to the selenium child process', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
      });
      const seleniumStandalone = require('selenium-standalone');
      selenium.install = jest.fn();
      selenium.install.mockImplementation((callback) => {
        callback(null);
      });
      const seleniumChild = {
        stderr: {
          on: jest.fn(),
        },
      };
      seleniumStandalone.start.mockImplementation((options, callback) => {
        callback(null, seleniumChild);
      });

      const callback = function () {};
      selenium.start(callback);

      expect(selenium.child).toBe(seleniumChild);
    });

    it('calls the callback with null when selenium has been started successfully', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
      });
      const seleniumStandalone = require('selenium-standalone');
      selenium.install = jest.fn((callback) => {
        callback(null);
      });
      const seleniumChild = {
        stderr: {
          on: jest.fn(),
        },
      };
      seleniumStandalone.start.mockImplementation((options, callback) => {
        callback(null, seleniumChild);
      });

      const callback = jest.fn();
      selenium.start(callback);

      expect(callback.mock.calls[0]).toEqual([null]);
    });

    it('calls the callback with the error when selenium fails to start', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({
        port: '4444',
        seleniumStandaloneOptions: {},
      });
      const seleniumStandalone = require('selenium-standalone');
      selenium.install = jest.fn();
      selenium.install.mockImplementation((callback) => {
        callback(null);
      });
      const error = new Error('Selenium start error');
      seleniumStandalone.start.mockImplementation((options, callback) => {
        callback(error);
      });

      const callback = jest.fn();
      selenium.start(callback);

      expect(callback.mock.calls[0]).toEqual([error]);
    });

    it('logs the output of the child process', () => {
      // TODO
    });

    it('calls the callback immediately with null when selenium is already running', () => {
      const seleniumStandalone = require('selenium-standalone');
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({port: '4444'});

      const callback = jest.fn();

      seleniumStandalone.start = jest.fn();

      selenium.child = 'not null';
      selenium.start(callback);

      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toBe(null);
      expect(seleniumStandalone.start.mock.calls.length).toBe(0);
    });
  });

  describe('stop', () => {
    describe('when selenium is running', () => {
      it('kills the selenium child', () => {
        const Selenium = require('../lib/selenium');
        delete Selenium.instance;
        const selenium = new Selenium({port: '4444'});
        const processHelper = require('../lib/process-helper');
        processHelper.kill = jest.fn();
        const seleniumChild = {
          pid: 1234,
        };
        selenium.child = seleniumChild;
        selenium.sessionManager = {};

        const callback = jest.fn();
        selenium.stop(callback);

        expect(processHelper.kill.mock.calls.length).toBe(1);
        expect(processHelper.kill.mock.calls[0][0]).toEqual({
          child: selenium.child,
          signal: 'SIGINT',
          prefix: 'selenium',
        });

        // simulate the callback
        processHelper.kill.mock.calls[0][1]('this', 'that');

        expect(selenium.child).toBe(null);
        expect(callback).toBeCalledWith('this', 'that');
      });
    });

    describe('when selenium is not running', () => {
      it('calls the callback immediately', () => {
        const Selenium = require('../lib/selenium');
        delete Selenium.instance;
        const selenium = new Selenium({port: '4444'});

        const callback = jest.fn();
        selenium.stop(callback);

        expect(selenium.child).toBe(null);
        expect(callback).toBeCalledWith(null);
      });
    });
  });

  describe('interrupt', () => {
    it('should return immediately in watch mode', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({port: '4444', watch: true});

      const callback = jest.fn();

      selenium.stop = jest.fn();

      selenium.interrupt(callback);

      expect(callback).toBeCalledWith(null);
      expect(selenium.stop.mock.calls.length).toBe(0);
    });

    it('should call kill when not in watch mode', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({port: '4444'});

      const callback = jest.fn();

      selenium.stop = jest.fn();

      selenium.interrupt(callback);

      expect(selenium.stop.mock.calls.length).toBe(1);
      expect(selenium.stop.mock.calls.length).toBe(1);
    });

    it('should call kill when --clean-selenium-server is true', () => {
      const Selenium = require('../lib/selenium');
      delete Selenium.instance;
      const selenium = new Selenium({port: '4444', 'clean-selenium-server': true});

      selenium.stop = jest.fn();

      const callback = 'callback';
      selenium.interrupt(callback);

      expect(selenium.stop.mock.calls.length).toBe(1);
      expect(selenium.stop.mock.calls[0][0]).toBe(callback);
    });
  });
});
