const service = require('.');

const { TCGA, ANVIL } = require('../../services');

describe('Specimen service tests', () => {
  let getAllTCGASpy;
  let getAllANVILSpy;
  let getByIdSpy;

  beforeEach(() => {
    getAllTCGASpy = jest.spyOn(TCGA.prototype, 'getAllResearchStudy').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        20,
      ];
    });

    getAllANVILSpy = jest.spyOn(ANVIL.prototype, 'getAllResearchStudy').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        25,
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

  it('should search for ResearchStudy', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: {} } });
    expect(getAllTCGASpy).toHaveBeenCalled();
    expect(getAllANVILSpy).toHaveBeenCalled();
  });

  it('should search only TCGA data', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: { _source: 'tcga' } } });
    expect(getAllTCGASpy).toHaveBeenCalled();
  });

  it('should search only ANVIL data', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: { _source: 'anvil' } } });
    expect(getAllANVILSpy).toHaveBeenCalled();
  });

  it('should search for ResearchStudy by ID', async () => {
    await service.searchById({ base_version: '4_0_0' }, { req: { params: { id: 'foobar' } } });
    expect(getByIdSpy).toHaveBeenCalled();
  });
});
