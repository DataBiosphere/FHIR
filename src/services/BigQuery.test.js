const BigQuery = require('./BigQuery');

describe('BigQuery client tests', () => {
  it('should call out to GCP BigQuery', async () => {
    const bigQueryClient = new BigQuery();
    const querySpy = jest.spyOn(bigQueryClient.api, 'query').mockImplementation(() => {});

    await bigQueryClient.sendQuery('select * from $foobar', { foobar: 'test' });

    expect(querySpy).toHaveBeenCalledWith({
      query: 'select * from $foobar',
      params: {
        foobar: 'test',
      },
      location: 'US',
    });
  });
});
