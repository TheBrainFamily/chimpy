// jest.dontMock('../lib/process-helper');


describe('process-helper', () => {
  describe('start', () => {
    it('spawns a child, calls the callback and returns the child', () => {
      const processHelper = require('../lib/process-helper.js');

      const child = {};
      const mockedSpawn = jest.spyOn(processHelper, "spawn");
      mockedSpawn.mockReturnValue(child);

      const options = {};
      const callback = jest.fn();
      const ret = processHelper.start(options, callback);

      expect(ret).toBe(child);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toBeFalsy();
      mockedSpawn.mockRestore();
    });

    it('waits for message if waitForMessage is provided and delegates the callback as is', () => {
      const processHelper = require('../lib/process-helper.js');
      const cp = require('child_process');

      const child = {};
      cp.spawn = jest.fn().mockReturnValue(child)
      const mockedSpawn = jest.spyOn(processHelper, "spawn");
      mockedSpawn.mockImplementation(() => {});

      const mockedWaitForMessage = jest.spyOn(processHelper, "waitForMessage");
      mockedWaitForMessage.mockImplementation(function (options, child, callback) {
        callback.apply(this, [1, 2, 3, 4]);
      });

      const options = {waitForMessage: 'not null'};
      const callback = jest.fn();
      const ret = processHelper.start(options, callback);

      expect(processHelper.waitForMessage.mock.calls.length).toBe(1);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0]).toEqual([1, 2, 3, 4]);
      mockedSpawn.mockRestore();
      mockedWaitForMessage.mockRestore();
    });
  });

  describe('spawn', () => {
    it('calls spawn with the binary and args and returns the child process', () => {
      const cp = require('child_process');
      const processHelper = require('../lib/process-helper.js');

      processHelper.logOutputs = jest.fn();

      const child = {};
      cp.spawn = jest.fn().mockReturnValue(child)

      const options = {
        bin: '/someBinary',
        args: ['bunch', 'of', 'args'],
      };
      const ret = processHelper.spawn(options);

      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe(options.bin);
      expect(cp.spawn.mock.calls[0][1]).toBe(options.args);
      expect(ret).toBe(child);
    });

    it('logs the outputs of the child process', () => {
      let cp = require('child_process'),
        processHelper = require('../lib/process-helper.js');

      processHelper.logOutputs = jest.fn();

      const child = {};
      spyOn(cp, 'spawn').and.returnValue(child);

      const options = {
        prefix: 'hey bear',
      };
      const ret = processHelper.spawn(options);

      expect(processHelper.logOutputs.mock.calls.length).toBe(1);
      expect(processHelper.logOutputs.mock.calls[0][0]).toBe(options.prefix);
      expect(processHelper.logOutputs.mock.calls[0][1]).toBe(child);
    });
  });

  describe('logOutputs', () => {
    it('logs the output of the child process stderr events', () => {
      let log = require('../lib/log.js'),
        processHelper = require('../lib/process-helper.js');

      log.debug = jest.fn();
      const child = {
        stdout: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventTrigger('blah');
            expect(event).toBe('data');
            expect(log.debug.mock.calls.length).toBe(1);
            expect(log.debug.mock.calls[0][0]).toBe('[chimp][prefix.stdout]');
            expect(log.debug.mock.calls[0][1]).toBe('blah');
          }),
        },
        stderr: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventTrigger('blah blah');
            expect(event).toBe('data');
            expect(log.debug.mock.calls.length).toBe(2);
            expect(log.debug.mock.calls[1][0]).toBe('[chimp][prefix.stderr]');
            expect(log.debug.mock.calls[1][1]).toBe('blah blah');
          }),
        },
      };

      processHelper.logOutputs('prefix', child);
    });
  });

  describe('waitForMessage', () => {
    it('removes the listener if the success message is seen and calls the callback', () => {
      const processHelper = require('../lib/process-helper.js');

      const callback = jest.fn();

      const options = {
        prefix: '[apollo]',
        waitForMessage: 'we have lift off',
      };

      let eventToBeRemovedStdOut = false;
      let eventToBeRemovedStdErr = false;
      const child = {
        stdout: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventToBeRemovedStdOut = eventTrigger;
            eventTrigger('Huston, we have lift off!');
          }),
          removeListener: jest.fn(),
        },
        stderr: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventToBeRemovedStdErr = eventTrigger;
            eventTrigger('Huston, we have lift off!');
          }),
          removeListener: jest.fn(),
        },
      };

      processHelper.waitForMessage(options, child, callback);

      expect(child.stdout.removeListener.mock.calls.length).toBe(1);
      expect(child.stdout.removeListener.mock.calls[0][0]).toBe('data');
      expect(child.stdout.removeListener.mock.calls[0][1]).toBe(eventToBeRemovedStdOut);

      expect(child.stderr.removeListener.mock.calls.length).toBe(1);
      expect(child.stderr.removeListener.mock.calls[0][0]).toBe('data');
      expect(child.stderr.removeListener.mock.calls[0][1]).toBe(eventToBeRemovedStdErr);

      expect(callback.mock.calls.length).toBe(2);
      expect(callback.mock.calls[0][0]).toBeFalsy();
      expect(callback.mock.calls[1][0]).toBeFalsy();
    });

    it('calls back with an error if the error message is seen', () => {
      const processHelper = require('../lib/process-helper.js');

      const callback = jest.fn();

      const options = {
        prefix: '[apollo]',
        waitForMessage: 'not empty',
        errorMessage: 'engine failure',
      };

      const eventToBeRemoved = false;
      const child = {
        stdout: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventTrigger('Huston, we have a problem - engine failure!');
          }),
        },
        stderr: {
          on: jest.fn().mockImplementation((event, eventTrigger) => {
            eventTrigger('Huston, we have a problem - engine failure!');
          }),
        },
      };

      processHelper.waitForMessage(options, child, callback);

      expect(callback.mock.calls.length).toBe(2);
      expect(callback.mock.calls[0][0]).toBe('Huston, we have a problem - engine failure!');
      expect(callback.mock.calls[1][0]).toBe('Huston, we have a problem - engine failure!');
    });
  });

  describe('kill', () => {
    it('kills the provided process, sets it to null and calls the callback when the process is dead', () => {
      const processHelper = require('../lib/process-helper.js');

      process.kill = jest.fn().mockImplementation(() => {
        // the first call checks if the process exists
        // the second call is the actual kill
        // subsequent calls are checking if the process exists
        // it takes 3 calls to go through all the execution paths for this SUT
        if (process.kill.mock.calls.length === 4) {
          throw ({code: 'ESRCH'});
        }
      });

      const options = {
        child: {
          pid: 1234,
        },
      };
      const callback = jest.fn();
      jest.useFakeTimers();
      processHelper.kill(options, callback);
      jest.runAllTimers();

      expect(process.kill.mock.calls.length).toBe(4);
      expect(process.kill.mock.calls[0][0]).toEqual(1234);
      expect(process.kill.mock.calls[0][1]).toBe(0);
      expect(process.kill.mock.calls[1][1]).toBe('SIGTERM');
      expect(process.kill.mock.calls[2][0]).toEqual(1234);
      expect(process.kill.mock.calls[2][1]).toEqual(0);
      expect(process.kill.mock.calls[3][0]).toEqual(1234);
      expect(process.kill.mock.calls[3][1]).toEqual(0);

      expect(options.child).toBe(null);

      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toBeFalsy();
    });
  });
});
