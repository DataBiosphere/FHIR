const service = require('.');

const { TCGA_SOURCE, ANVIL_SOURCE } = require('../../utils');
const { TCGA, ANVIL } = require('../../services');

describe('Observation service tests', () => {
  let getAllTCGASpy;
  let getAllANVILSpy;
  let getByTCGAIdSpy;
  let getByANVILIdSpy;

  beforeEach(() => {
    getAllTCGASpy = jest.spyOn(TCGA.prototype, 'getAllDiagnoses').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        20,
      ];
    });

    getAllANVILSpy = jest.spyOn(ANVIL.prototype, 'getAllObservations').mockImplementation(() => {
      return [
        [
          {
            id: 'foobar',
          },
        ],
        25,
      ];
    });

    getByTCGAIdSpy = jest.spyOn(TCGA.prototype, 'getDiagnosisById').mockImplementation(async () => {
      return {
        id: 'foobar',
      };
    });

    getByANVILIdSpy = jest
      .spyOn(ANVIL.prototype, 'getObservationById')
      .mockImplementation(async () => {
        return {
          id: 'foobar',
        };
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for Observation', async () => {
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

  it('should search for Observation by TCGA ID', async () => {
    await service.searchById(
      { base_version: '4_0_0' },
      { req: { params: { id: 'TCGA-HNSC' }, query: { _source: TCGA_SOURCE } } }
    );
    expect(getByTCGAIdSpy).toHaveBeenCalled();
  });

  it('should search for Observation by ANVIL ID', async () => {
    await service.searchById(
      { base_version: '4_0_0' },
      {
        req: {
          params: { id: 'AnVIL_CMG_Broad_Blood_Gazda_WGS' },
          query: { _source: ANVIL_SOURCE },
        },
      }
    );
    expect(getByANVILIdSpy).toHaveBeenCalled();
  });
});
