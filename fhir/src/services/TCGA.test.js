const axios = require('axios');
const TCGA = require('./TCGA');

jest.mock('axios');

describe('TCGA service tests', () => {
  it('should get all TCGA data', async () => {
    axios.get.mockImplementation(() => [{ case: 'foobar' }]);

    const tcga = new TCGA();
    const results = await tcga.getAll({ page: 2, pageSize: 10 });

    expect(results).toEqual([{ case: 'foobar' }]);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/tcga', {
      params: { page: 2, pageSize: 10 },
    });
  });
});
