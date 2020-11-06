const service = require('.');

const { TCGA } = require('../../services');

describe('DiagnosticReport service tests', () => {
  let getAllSpy;
  let getByIdSpy;

  beforeEach(() => {
    getAllSpy = jest.spyOn(TCGA.prototype, 'getAllDiagnosticReports').mockImplementation(() => {
      return [
        [
          {
            diagnosticReport: [{ id: 'foobar' }],
          },
        ],
        1,
      ];
    });

    getByIdSpy = jest.spyOn(TCGA.prototype, 'getDiagnosticReportById').mockImplementation(() => {
      return {
        id: 'foobar',
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for DiagnosticReport', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: {} } });
    expect(getAllSpy).toHaveBeenCalled();
  });

  it('should search for DiagnosticReport by ID', async () => {
    await service.searchById({ base_version: '4_0_0' }, { req: { params: { id: 'foobar' } } });
    expect(getByIdSpy).toHaveBeenCalled();
  });
});
