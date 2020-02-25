'use strict';

var Hapi = {
  instance: {
    connection: jest.fn(),
    route: jest.fn(),
    start: jest.fn(),
  },
  Server: function () {
    return Hapi.instance;
  }
};

module.exports = Hapi;
