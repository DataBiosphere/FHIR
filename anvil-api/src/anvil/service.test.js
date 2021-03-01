const anvilResults = require('../../__fixtures__/anvil/anvilresults.json');

const AnvilMongo = require('../services/AnvilMongo');

jest.mock('../services/AnvilMongo');

AnvilMongo.mockImplementation(() => ({
  find: () => [anvilresults, 10],
}));

const service = require('./service');

describe('service tests', () => {
  it('should check my sanity', () => {
    expect(1).toEqual(1);
  });

  // TODO: make tests for each getfunction after tables are sorted out
  // it('should getByID', async () => {
  //   const rows = await service.getWorkspaceById('foobar');
  //   expect(rows).toEqual({});
  // });
});
