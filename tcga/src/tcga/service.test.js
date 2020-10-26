const BigQuery = require('../services/BigQuery');

jest.mock('../services/BigQuery');

BigQuery.mockImplementation(() => ({
  get: () => [{ message: 'test' }],
}));

const service = require('./service');

describe('service tests', () => {
  it('should getAll', async () => {
    const res = await service.getAll();
    expect(res).toEqual([{ message: 'test' }]);
  });
});
