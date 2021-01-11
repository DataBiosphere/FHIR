const service = require('.');

const { TCGA } = require('../../services');

describe('Specimen service tests', () => {
  let getAllSpy;
  let getByIdSpy;

  beforeEach(() => {
    getAllSpy = jest.spyOn(TCGA.prototype, 'getAllResearchStudy').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        20,
      ];
    });

    getByIdSpy = jest.spyOn(TCGA.prototype, 'getResearchStudyById').mockImplementation(() => {
      return {
        id: 'foobar',
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for Specimen', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: {} } });
    expect(getAllSpy).toHaveBeenCalled();
  });

  it('should search for Specimen by ID', async () => {
    await service.searchById({ base_version: '4_0_0' }, { req: { params: { id: 'foobar' } } });
    expect(getByIdSpy).toHaveBeenCalled();
  });
});
