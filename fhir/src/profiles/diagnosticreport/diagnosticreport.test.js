const service = require('.');

const TCGAService = require('../../services');

describe('DiagnosticReport service tests', () => {
  let getAllSpy;

  beforeEach(() => {
    getAllSpy = jest.spyOn(TCGAService.prototype, 'getAll').mockImplementation(() => [[]]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for DiagnosticReport', () => {
    service.search({ base_version: 'api' }, { req: { query: {} } });
    expect(getAllSpy).toHaveBeenCalled();
  });
});
