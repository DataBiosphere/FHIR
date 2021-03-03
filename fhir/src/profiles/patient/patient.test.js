const service = require('.');

const { TCGA_SOURCE, ANVIL_SOURCE } = require('../../utils');
const { TCGA, ANVIL } = require('../../services');

describe('Research Study service tests', () => {
  let getAllTCGASpy;
  let getAllANVILSpy;
  let getByTCGAIdSpy;
  let getByANVILIdSpy;

  beforeEach(() => {
    getAllTCGASpy = jest.spyOn(TCGA.prototype, 'getAllPatients').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        20,
      ];
    });

    getAllANVILSpy = jest.spyOn(ANVIL.prototype, 'getAllPatients').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        25,
      ];
    });

    getByTCGAIdSpy = jest.spyOn(TCGA.prototype, 'getPatientById').mockImplementation(async () => {
      return {
        id: 'foobar',
      };
    });

    getByANVILIdSpy = jest.spyOn(ANVIL.prototype, 'getPatientById').mockImplementation(async () => {
      return {
        id: 'foobar',
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for Patient', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: {} } });
    expect(getAllTCGASpy).toHaveBeenCalled();
    expect(getAllANVILSpy).toHaveBeenCalled();
  });

  it('should search only TCGA data', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: { _source: TCGA_SOURCE } } });
    expect(getAllTCGASpy).toHaveBeenCalled();
  });

  it('should search only ANVIL data', async () => {
    await service.search({ base_version: '4_0_0' }, { req: { query: { _source: ANVIL_SOURCE } } });
    expect(getAllANVILSpy).toHaveBeenCalled();
  });

  it('should search for Patient by TCGA ID', async () => {
    await service.searchById(
      { base_version: '4_0_0' },
      { req: { params: { id: '2611cb61-6d05-5286-b94a-ce6cac2ba37b' } } }
    );
    expect(getByTCGAIdSpy).toHaveBeenCalled();
  });

  it('should search for Patient by ANVIL ID', async () => {
    await service.searchById(
      { base_version: '4_0_0' },
      {
        req: {
          params: {
            id: 'AnVIL_CCDG_Broad_NP_Epilepsy_AUSAUS_EP_BA_CN_ID_MDS_WES-Su-C2021_AUSAUST26235',
          },
        },
      }
    );
    expect(getByANVILIdSpy).toHaveBeenCalled();
  });
});
