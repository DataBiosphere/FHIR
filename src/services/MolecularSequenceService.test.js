const MolecularSequenceService = require('./MolecularSequenceService');

describe('MolecularSequenceService tests', () => {
  it('should build a GetAll query', async () => {
    const molecularSequenceService = new MolecularSequenceService();
    const spy = jest
      .spyOn(molecularSequenceService.api, 'sendQuery')
      .mockImplementation(async () => {
        return [];
      });
    await molecularSequenceService.getAll();
    expect(spy).toHaveBeenCalledWith(
      `select * from \`${process.env.BIGQUERY_TABLE_NAME}\` limit 20`
    );
  });
  it('should paginate SQL correctly given page and pagesize', () => {
    const molecularSequenceService = new MolecularSequenceService();
    const [offset, limit] = molecularSequenceService.paginate(0, 20);
    expect(offset).toEqual(0);
    expect(limit).toEqual(20);
  });
});
