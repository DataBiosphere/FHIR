const axios = require('axios');
const TCGA = require('./TCGA');

jest.mock('axios');

describe('TCGA service tests', () => {
  it('should get all TCGA data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [{ case_id: 'foobar' }] } }));

    const tcga = new TCGA();
    const [results, count] = await tcga.getAll({ page: 2, pageSize: 10 });

    expect(results).toEqual([{ case_id: 'foobar' }]);
    expect(count).toEqual(10);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/tcga', {
      params: { page: 2, pageSize: 10 },
    });
  });

  it('should get TCGA data by case ID', async () => {
    axios.get.mockImplementation(() => ({ data: { case_id: 'foobar' } }));

    const tcga = new TCGA();
    const results = await tcga.getByCaseId('foobar');

    expect(results).toEqual({ case_id: 'foobar' });
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/tcga/foobar');
  });
});
