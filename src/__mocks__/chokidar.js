'use strict';

var chokidar = {
  watcher: {
    on: jest.fn(),
    once: jest.fn()
  },
  watch: jest.fn()
};
chokidar.watch.mockReturnValue(chokidar.watcher);

module.exports = chokidar;
