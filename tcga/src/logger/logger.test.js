const logger = require('.');

describe('Logger tests', () => {
  it('should have a winston logger', () => {
    expect(logger.constructor.name).toEqual('DerivedLogger');
  });
});
