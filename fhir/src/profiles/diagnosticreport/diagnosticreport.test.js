const service = require('.');

const { TCGA } = require('../../services');

describe('DiagnosticReport service tests', () => {
  let getAllSpy;

  beforeEach(() => {
    getAllSpy = jest.spyOn(TCGA.prototype, 'getAll').mockImplementation(() => {
      return {
        data: [
          {
            message: 'foobar',
          },
        ],
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
});
