const axios = require('axios');
const {
  workspaceFixture,
  sampleFixture,
  subjectFixture,
} = require('../../../__fixtures__/anvilResponse');
const ANVIL = require('.');

jest.mock('axios');

describe('ANVIL service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all ANVIL ResearchStudy data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [workspaceFixture] } }));

    const anvil = new ANVIL();
    const [results, count] = await anvil.getAllResearchStudy({ page: 2, pageSize: 10 });

    expect(JSON.parse(JSON.stringify(results))).toEqual([{}, 0]);
    expect(count).toEqual(10);
    expect(axios.get).toHaveBeenCalledWith('http://anvil/api/workspace', {
      params: { page: 2, pageSize: 10 },
    });
  });
});
