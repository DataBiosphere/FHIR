const axios = require('axios');
const ANVIL = require('./index');

jest.mock('axios');

// TODO: figure out how to test without using Translator
describe('ANVIL service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all ANVIL Patient data', async () => {
    axios.get.mockImplementationOnce(() => ({ data: { count: 10, results: [] } }));

    const anvil = new ANVIL();
    const [_, count] = await anvil.getAllPatients({ _page: 2, _count: 10 });

    expect(count).toEqual(10);
  });
});
