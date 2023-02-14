jest.dontMock('../lib/chimp.js');
jest.dontMock('../lib/boolean-helper');
jest.dontMock('underscore');
jest.dontMock('async');
jest.dontMock('wrappy');
jest.dontMock('../lib/cucumberjs/cucumber.js');

beforeEach(() => {
  jest.resetModules();
});
describe('Chimp', () => {
  jest.genMockFromModule('chromedriver');
  jest.genMockFromModule('fs-extra');

  const Chimp = require('../lib/chimp');
  describe('bin path', () => {
    it('sets the bin path to the location of chimp', () => {
      expect(Chimp.bin.match(/bin\/chimp$/)).not.toBe(null);
    });
  });

  describe('init', () => {
    it('calls selectMode right away if it does not find package.json', () => {
      const chimp = new Chimp();

      const restore = chimp.fs.existsSync;
      chimp.fs.existsSync = jest.fn().mockReturnValue(false);

      chimp.informUser = jest.fn();
      chimp.exec = jest.fn();

      chimp.selectMode = jest.fn();
      const callback = function () {};

      chimp.init(callback);

      expect(chimp.selectMode).toBeCalledWith(callback);
      expect(chimp.exec).not.toBeCalled();

      chimp.fs.existsSync = restore;
    });

    it('does not executes npm install if the offline option is set', () => {
      const chimp = new Chimp({offline: true});

      const restore = chimp.fs.existsSync;
      chimp.fs.existsSync = jest.fn().mockReturnValue(true);

      chimp.informUser = jest.fn();
      chimp.exec = jest.fn();

      chimp.selectMode = jest.fn();
      const callback = jest.fn();

      chimp.init(callback);

      expect(chimp.exec.mock.calls.length).toBe(0);
      expect(chimp.selectMode.mock.calls.length).toBe(1);
      expect(callback.mock.calls.length).toBe(0);

      chimp.fs.existsSync = restore;
    });

    it('executes npm install then calls selectMode when there are no errors', () => {
      const chimp = new Chimp();

      const restore = chimp.fs.existsSync;
      chimp.fs.existsSync = jest.fn().mockReturnValue(true);

      chimp.informUser = jest.fn();
      chimp.exec = jest.fn().mockImplementation((cmd, callback) => callback(null));


      chimp.selectMode = jest.fn();
      const callback = function () {};

      chimp.init(callback);

      expect(chimp.selectMode).toBeCalledWith(callback);

      chimp.fs.existsSync = restore;
    });
  });

  describe('selectMode', () => {
    it('runs in single mode when no mode option is passed', () => {
      const chimp = new Chimp();

      const mockedWatch = jest.spyOn(chimp, "watch");
      const mockedRun = jest.spyOn(chimp, "run");
      const mockedServer = jest.spyOn(chimp, "server");
      const callback = function () {};

      chimp.selectMode(callback);

      expect(mockedRun.mock.calls.length).toBe(1);
      expect(mockedRun.mock.calls[0][0]).toBe(callback);

      expect(mockedWatch.mock.calls.length).toBe(0);
      expect(mockedServer.mock.calls.length).toBe(0);
      mockedWatch.mockRestore();
      mockedRun.mockRestore();
      mockedServer.mockRestore();
    });

    it('runs in watch mode)', () => {
      const chimp = new Chimp({watch: true});

      const mockedWatch = jest.spyOn(chimp, "watch");
      const mockedRun = jest.spyOn(chimp, "run");
      const mockedServer = jest.spyOn(chimp, "server");

      chimp.selectMode();

      expect(mockedWatch.mock.calls.length).toBe(1);
      expect(mockedWatch.mock.calls[0].length).toBe(0);

      expect(mockedRun.mock.calls.length).toBe(0);
      expect(mockedServer.mock.calls.length).toBe(0);
      mockedWatch.mockRestore();
      mockedRun.mockRestore();
      mockedServer.mockRestore();
    });

    it('runs in server mode)', () => {
      const chimp = new Chimp({server: true});

      const mockedWatch = jest.spyOn(chimp, "watch");
      const mockedRun = jest.spyOn(chimp, "run");
      const mockedServer = jest.spyOn(chimp, "server");

      chimp.selectMode();

      expect(mockedServer.mock.calls.length).toBe(1);
      expect(typeof mockedServer.mock.calls[0][0]).toBe('undefined');

      expect(mockedRun.mock.calls.length).toBe(0);
      expect(mockedWatch.mock.calls.length).toBe(0);
      mockedWatch.mockRestore();
      mockedRun.mockRestore();
      mockedServer.mockRestore();
    });
  });

  describe('watch', () => {
    it('initializes chokidar', () => {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });

      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);

      const Chimp = require('../lib/chimp.js');
      const options = {path: 'abc'};
      const chimp = new Chimp(options);
      chimp.run = jest.fn();

      chimp.watch();

      expect(chokidar.watch.mock.calls.length).toEqual(1);
      expect(chokidar.watch.mock.calls[0][0]).toEqual([options.path]);
    });

    it('all listener is registered after watcher is ready', () => {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const Chimp = require('../lib/chimp.js');

      const options = {path: 'abc'};
      const chimp = new Chimp(options);

      chimp.run = jest.fn();
      chokidar.watcher.on = jest.fn();
      chokidar.watcher.once = jest.fn();

      chimp.watch();
      expect(chokidar.watcher.once.mock.calls[0][0]).toBe('ready');

      const readyCallback = chokidar.watcher.once.mock.calls[0][1];

      readyCallback();
      expect(chokidar.watcher.on.mock.calls[0][0]).toBe('all');
    });

    it('an non-unlink event triggers the interrupt and run sequence', function () {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const Chimp = require('../lib/chimp.js');

      const chimp = new Chimp();

      chimp.run = jest.fn();

      const self = this;
      self.func = null;
      self.timeout = null;
      chimp._getDebouncedFunction = function (func, timeout) {
        self.allCallback = func;
        self.timeout = timeout;
      };

      chimp.watch();

      const readyCallback = chokidar.watcher.once.mock.calls[0][1];
      readyCallback();

      chimp.rerun = jest.fn();

      self.allCallback('not-unlink');

      expect(chimp.rerun.mock.calls.length).toBe(1);
    });

    it('a deleted feature does not trigger the interrupt and run sequence', () => {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const Chimp = require('../lib/chimp.js');

      // var _on = process.on;
      // process.on = jest.fn();

      const chimp = new Chimp();

      chimp.run = jest.fn();

      chimp.watch();

      const readyCallback = chokidar.watcher.once.mock.calls[0][1];
      readyCallback();

      const allCallback = chokidar.watcher.on.mock.calls[0][1];

      chimp.rerun = jest.fn();

      allCallback('unlink', '/path/some.feature');

      expect(chimp.rerun.mock.calls.length).toBe(0);

      // process.on = _on;
    });

    it('a deleted non-feature triggers the interrupt and run sequence', function () {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const async = require('async');
      const Chimp = require('../lib/chimp.js');

      const chimp = new Chimp();

      chimp.run = jest.fn();

      const self = this;
      self.func = null;
      self.timeout = null;
      chimp._getDebouncedFunction = function (func, timeout) {
        self.allCallback = func;
        self.timeout = timeout;
      };

      chimp.watch();

      const readyCallback = chokidar.watcher.once.mock.calls[0][1];
      readyCallback();

      chimp.rerun = jest.fn();

      this.allCallback('unlink', '/path/some.feature.js');

      expect(chimp.rerun.mock.calls.length).toBe(1);
    });

    it('runs on startup', () => {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const Chimp = require('../lib/chimp.js');

      const chimp = new Chimp();

      chimp.run = jest.fn();

      chimp.watch();

      const readyCallback = chokidar.watcher.once.mock.calls[0][1];
      readyCallback();

      expect(chimp.run.mock.calls.length).toBe(1);
    });

    it('uses the watchTag with cucumber', () => {
      jest.doMock('chokidar', () => {
        return {
          watch: jest.fn(),
          watcher: {
            on: jest.fn(),
            once: jest.fn(),
          },
        };
      });
      const chokidar = require('chokidar');
      chokidar.watch.mockReturnValue(chokidar.watcher);
      const Chimp = require('../lib/chimp.js');

      const chimp = new Chimp({
        watchTags: '@someTag,@andAnotherTag',
      });

      chimp.watch();

      expect(chimp.options.tags).toBe('@someTag,@andAnotherTag');
    });
  });

  describe('server', () => {
    it('listens on a freeport when server-port is not provided', () => {
      const freeport = require('freeport');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp();

      chimp.server();

      expect(freeport.mock.calls.length).toBe(1);
    });

    it('listens on the server-port when it is provided', () => {
      const freeport = require('freeport');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverPort: 1234});

      chimp._startServer = jest.fn();

      chimp.server();

      expect(chimp._startServer.mock.calls.length).toBe(1);
      expect(chimp._startServer.mock.calls[0][0]).toBe(1234);
      expect(freeport.mock.calls.length).toBe(0);
    });

    it('handshakes with a DDP endpoint with the server address on startup if ddp is passed', () => {

      // TODO having some issues testing this. DDPClient is tricky to jest up

    });

    it('exposes the run and interrupt endpoints', () => {
      const Hapi = require('hapi');

      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverHost: 'localhost', serverPort: 1234});

      chimp.server();

      expect(Hapi.instance.route.mock.calls[0][0].method).toBe('GET');
      expect(Hapi.instance.route.mock.calls[0][0].path).toBe('/run');

      expect(Hapi.instance.route.mock.calls[1][0].method).toBe('GET');
      expect(Hapi.instance.route.mock.calls[1][0].path).toBe('/run/{absolutePath*}');

      expect(Hapi.instance.route.mock.calls[2][0].method).toBe('GET');
      expect(Hapi.instance.route.mock.calls[2][0].path).toBe('/interrupt');

      expect(Hapi.instance.route.mock.calls[3][0].method).toBe('GET');
      expect(Hapi.instance.route.mock.calls[3][0].path).toBe('/runAll');
    });

    it('returns cucumber results when run handler is called successfully', () => {
      const Hapi = require('hapi');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverHost: 'localhost', serverPort: 1234});

      chimp.rerun = jest.fn().mockImplementation(callback => callback(null,
          [null, [null, 'cucumber results']],
        ));


      chimp.server();
      const getHandler = Hapi.instance.route.mock.calls[0][0].handler;
      const headerMock = jest.fn();
      const reply = jest.fn().mockReturnValue({header: headerMock});
      getHandler(null, reply);

      expect(reply.mock.calls[0][0]).toBe('cucumber results');
    });

    it('returns cucumber results when run handler is called successfully with a feature', () => {
      const Hapi = require('hapi');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverHost: 'localhost', serverPort: 1234});
      chimp.options._ = {};

      chimp.rerun = jest.fn().mockImplementation(callback => callback(null,
          [null, [null, 'cucumber results']],
        ));

      chimp.server();
      const getHandler = Hapi.instance.route.mock.calls[1][0].handler;
      const request = {params: {absolutePath: 'blah'}};
      const headerMock = jest.fn();
      const reply = jest.fn().mockReturnValue({header: headerMock});
      getHandler(request, reply);

      expect(chimp.options._[2]).toBe(request.params.absolutePath);
      expect(reply.mock.calls[0][0]).toBe('cucumber results');
    });

    it('returns "done" when interrupt handler is called successfully', () => {
      const Hapi = require('hapi');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverHost: 'localhost', serverPort: 1234});

      chimp.interrupt = jest.fn().mockImplementation(callback => callback(null,
          [null, [null, 'cucumber results']],
        ));

      chimp.server();
      const interruptHandler = Hapi.instance.route.mock.calls[2][0].handler;
      const headerMock = jest.fn();
      const reply = jest.fn().mockReturnValue({header: headerMock});
      interruptHandler(null, reply);

      expect(reply.mock.calls[0][0]).toBe('done');
    });

    it('returns cucumber results when runAll handler is called successfully', () => {
      const Hapi = require('hapi');
      const Chimp = require('../lib/chimp.js');
      const chimp = new Chimp({serverHost: 'localhost', serverPort: 1234});

      chimp.rerun = jest.fn().mockImplementation(callback => callback(null,
          [null, [null, 'cucumber results']],
        ));

      chimp.server();
      const getHandler = Hapi.instance.route.mock.calls[3][0].handler;
      const headerMock = jest.fn();
      const reply = jest.fn().mockReturnValue({header: headerMock});
      getHandler(null, reply);

      expect(reply.mock.calls[0][0]).toBe('cucumber results');
    });
  });

  describe('run', () => {
    it('interrupts any existing processes, starts processes and calls callback', () => {
      const chimp = new Chimp();

      chimp.interrupt = jest.fn().mockImplementation(callback => callback());
      chimp._startProcesses = jest.fn().mockImplementation(callback => callback());

      const callback = jest.fn();
      chimp.run(callback);

      expect(chimp.interrupt.mock.calls.length).toBe(2);
      expect(chimp._startProcesses.mock.calls.length).toBe(1);
      expect(callback.mock.calls.length).toBe(1);
    });

    it('detects errors in interrupt and calls callback with an error', () => {
      const chimp = new Chimp();

      chimp.interrupt = jest.fn().mockImplementation(callback => callback('error'));

      const callback = jest.fn();
      chimp.run(callback);

      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toEqual('error');
    });

    it('stops all processes on successful runs', () => {
      const chimp = new Chimp();

      chimp.interrupt = jest.fn().mockImplementation(callback => callback());
      chimp._startProcesses = jest.fn().mockImplementation(callback => callback());

      chimp.stop = jest.fn();

      const callback = jest.fn();
      chimp.run(callback);

      expect(chimp.interrupt.mock.calls.length).toBe(2);
    });

    it('passes the options to the simian reporter constructor', () => {
      const SimianReporter = require('../lib/simian-reporter');

      const Chimp = require('../lib/chimp.js');

      const options = {simianAccessToken: 'present'};
      const chimp = new Chimp(options);

      chimp.interrupt = jest.fn().mockImplementation(callback => callback());
      chimp._startProcesses = jest.fn().mockImplementation(callback => callback());

      const callback = jest.fn();
      chimp.run(callback);

      expect(SimianReporter.mock.calls[0][0]).toBe(options);
      expect(SimianReporter.mock.calls.length).toBe(1);
    });

    it('calls the simian reporter when the run is finished', () => {
      jest.dontMock('../lib/simian-reporter');
      const SimianReporter = require('../lib/simian-reporter');
      SimianReporter.prototype.report = jest.fn();

      const Chimp = require('../lib/chimp.js');

      const options = {simianAccessToken: 'present'};
      const chimp = new Chimp(options);

      chimp.interrupt = jest.fn().mockImplementation(callback => callback(null, 'hello'));
      chimp._startProcesses = jest.fn().mockImplementation(callback => callback(null, [undefined, '[]']));

      const callback = jest.fn();
      chimp.run(callback);

      expect(SimianReporter.instance.report.mock.calls.length).toBe(1);
    });
  });

  describe('interrupt', () => {
    it('calls interrupt on all processes in the reverse order that they were started', () => {
      jest.dontMock('async');
      const Chimp = require('../lib/chimp');

      const chimp = new Chimp();

      let orderCounter = 0;

      function Process() {
        this.orderRun = -1;
      }

      Process.prototype.interrupt = function (callback) {
        this.orderRun = orderCounter++;
        callback();
      };

      const process1 = new Process('1');
      const process2 = new Process('2');
      chimp.processes = [process1, process2];

      const callback = jest.fn();

      chimp.interrupt(callback);

      expect(process2.orderRun).toBe(0);
      expect(process1.orderRun).toBe(1);
    });

    it('bubbles callback without modifying the arguments', () => {
      const async = require('async');
      const Chimp = require('../lib/chimp');

      const chimp = new Chimp();
      chimp.processes = [{interrupt: jest.fn()}];
      const someArgs = ['some', 'args'];

      async.series = jest.fn().mockImplementation(function (processes, callback) {
        callback.apply(this, someArgs);
      });

      const callback = jest.fn();
      chimp.interrupt(callback);

      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0]).toEqual(['some', 'args']);
    });

    it('calls the callback when no processes have been started', () => {
      const async = require('async');
      const Chimp = require('../lib/chimp');

      const chimp = new Chimp();
      chimp.isInterrupting = true;

      async.series = jest.fn();

      const callback = jest.fn();
      chimp.interrupt(callback);

      expect(chimp.isInterrupting).toBe(false);
      expect(callback.mock.calls.length).toBe(1);
      expect(async.series.mock.calls.length).toBe(0);
    });

    it('cancels the isInterrupting flag after all processes have run with no errors', () => {
      const _ = require('underscore');
      const async = require('async');
      const Chimp = require('../lib/chimp');
      const chimp = new Chimp();

      chimp.isInterrupting = true;
      chimp.processes = ['yo'];
      _.collect = jest.fn();

      async.series = jest.fn().mockImplementation((procs, func) => {
        func();
      });

      chimp.interrupt(jest.fn());

      expect(chimp.isInterrupting).toBe(false);
    });

    it('cancels the isInterrupting flag after all processes have run with errors', () => {
      const _ = require('underscore');
      const async = require('async');
      const Chimp = require('../lib/chimp');
      const chimp = new Chimp();

      chimp.isInterrupting = true;
      chimp.processes = ['yo'];
      _.collect = jest.fn();

      async.series = jest.fn().mockImplementation((procs, func) => {
        func('error');
      });

      chimp.interrupt(jest.fn());

      expect(chimp.isInterrupting).toBe(false);
    });
  });

  describe('rerun', () => {
    it('calls run if interrupt is successful', () => {
      const chimp = new Chimp();

      chimp.interrupt = jest.fn().mockImplementation((callback) => {
        callback(null);
      });

      chimp.run = jest.fn();

      chimp.rerun();

      expect(chimp.run.mock.calls.length).toBe(1);
    });

    it('does not rerun if an rerun is in progress', () => {
      const chimp = new Chimp();

      chimp.run = jest.fn();

      chimp.isInterrupting = true;
      chimp.rerun();

      expect(chimp.run.mock.calls.length).toBe(0);
    });

    it('reruns once it has finished rerunning', () => {
      const chimp = new Chimp();

      chimp.run = jest.fn().mockImplementation((callback) => {
        callback(null);
        // after the first run, replace this mockImplementation with a standard mock so we
        // can assert on that the rerun interrupts after a successful run
        chimp.run = jest.fn();
      });

      chimp.rerun();
      chimp.rerun();

      expect(chimp.run.mock.calls.length).toBe(1);
    });
  });

  describe('_startProcesses', () => {
    it('creates an array of series of processes and starts them', () => {
      const async = require('async');

      const Chimp = require('../lib/chimp.js');

      async.series = jest.fn();

      const chimp = new Chimp();
      const processes = [];
      const mockedCreateProcesses = jest.spyOn(chimp, "_createProcesses");
      mockedCreateProcesses.mockReturnValue(processes);

      chimp._startProcesses();

      expect(mockedCreateProcesses.mock.calls.length).toBe(1);
      expect(chimp.processes).toBe(processes);
      mockedCreateProcesses.mockRestore();
    });

    it('start each process in its own context and calls callback once', () => {
      jest.dontMock('async');
      const Chimp = require('../lib/chimp');

      const chimp = new Chimp();

      function Process() {
        this.state = 'constructed';
      }

      Process.prototype.start = function (callback) {
        this.state = 'started';
        callback();
      };

      const processes = [new Process(), new Process()];
      const mockedCreateProcesses = jest.spyOn(chimp, "_createProcesses");
      mockedCreateProcesses.mockReturnValue(processes);

      const callback = jest.fn();

      chimp._startProcesses(callback);

      expect(typeof callback.mock.calls[0][0]).toBe('undefined');
      expect(callback.mock.calls.length).toBe(1);
      expect(processes[0].state).toBe('started');
      expect(processes[1].state).toBe('started');
      mockedCreateProcesses.mockRestore();
    });

    it('bubbles up errors in callback if an processes callback with an error', () => {
      jest.dontMock('async');
      const Chimp = require('../lib/chimp');

      const chimp = new Chimp();

      function Process() {
        this.state = 'constructed';
      }

      Process.prototype.start = function (callback) {
        this.state = 'started';
        callback('error!');
      };

      const processes = [new Process('1'), new Process('2')];
      const mockedCreateProcesses = jest.spyOn(chimp, "_createProcesses");
      mockedCreateProcesses.mockReturnValue(processes);

      const callback = jest.fn();

      chimp._startProcesses(callback);

      expect(callback.mock.calls[0][0]).toBe('error!');
      expect(callback.mock.calls.length).toBe(1);
      expect(processes[0].state).toBe('started');
      expect(processes[1].state).toBe('constructed');
      mockedCreateProcesses.mockRestore();
    });

    it('cancels the isInterrupting flag on error', () => {
      const _ = require('underscore');
      const async = require('async');
      const Chimp = require('../lib/chimp');
      const chimp = new Chimp();

      chimp.isInterrupting = true;
      const mockedCreateProcesses = jest.spyOn(chimp, "_createProcesses");
      mockedCreateProcesses.mockImplementation(() => [{ start: { bind: () => 'yo' } }]);

      async.series = jest.fn().mockImplementation((procs, func) => {
        func('error');
      });

      chimp._startProcesses(jest.fn());

      expect(chimp.isInterrupting).toBe(false);
      mockedCreateProcesses.mockRestore();

    });
  });

  describe('_createProcesses', () => {

    it('adds a selenium when no browser is passed', () => {
      let Selenium = require('../lib/selenium.js');
      const Chimp = require('../lib/chimp.js');
      Selenium = jest.fn();

      const options = {browser: 'some-browser', host: ''};
      const chimp = new Chimp(options);

      const processes = chimp._createProcesses();
      expect(Selenium.mock.calls[0][0]).toBe(options);
      expect(processes.length).toBe(2);
    });

    it('does not add selenium when SauceLabs is the host', () => {
      let Selenium = require('../lib/selenium.js');
      const Chimp = require('../lib/chimp.js');
      Selenium = jest.fn();

      const options = {host: 'saucelabs'};
      const chimp = new Chimp(options);

      const processes = chimp._createProcesses();

      expect(Selenium.mock.calls.length).toBe(0);
      expect(processes.length).toBe(1);
    });

  });
});
