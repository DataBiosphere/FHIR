const axios = require('axios');
const tcgaResponseFixture = require('../../../__fixtures__/tcgaResponse');
const TCGA = require('.');

jest.mock('axios');

// TODO: update TCGA tests
describe('TCGA service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all TCGA DiagnosticReport data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [] } }));

    const tcga = new TCGA();
    const [results, count] = await tcga.getAllDiagnosticReports({ _page: 2, _count: 10 });

    expect(count).toEqual(10);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/diagnosticreport', {
      params: { _page: 2, _count: 10 },
    });
  });

  it('should get TCGA data by case ID', async () => {
    axios.get.mockImplementation(() => ({ data: tcgaResponseFixture }));

    const tcga = new TCGA();
    const results = await tcga.getDiagnosticReportById('foobar');

    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/diagnosticreport/foobar');
  });

  it('should get all Research Study data', async () => {
    axios.get.mockImplementation(() => ({ data: { results: [], count: 1 } }));

    const tcga = new TCGA();
    const [_, count] = await tcga.getAllResearchStudy({ _page: 1, _count: 1 });

    expect(count).toEqual(1);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/researchstudy', {
      params: { _page: 1, _count: 1 },
    });
  });
});
