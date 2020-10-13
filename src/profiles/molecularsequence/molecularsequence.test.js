const service = require('.');

const MolecularSequenceService = require('../../services/MolecularSequenceService');

describe('MolecularSequence service tests', () => {
  let getAllSpy;

  beforeEach(() => {
    getAllSpy = jest
      .spyOn(MolecularSequenceService.prototype, 'getAll')
      .mockImplementation(() => [[]]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search for MolecularSequence', () => {
    service.search({ base_version: 'api' }, { req: { query: {} } });
    expect(getAllSpy).toHaveBeenCalled();
  });
});