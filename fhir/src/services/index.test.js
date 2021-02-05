const index = require('.');

describe('Index has the appropriate values defined', () => {
  it('should have the proper values defined', () => {
    expect(index.TCGA).toBeDefined();
    expect(index.ANVIL).toBeDefined();
  });
});
