const BigQuery = require('./BigQuery');

describe('BigQuery client tests', () => {
  it('should call out to GCP BigQuery', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
    });
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

  it('should build a query to get data', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
    });
    const querySpy = jest.spyOn(bigQueryClient, 'sendQuery').mockImplementation(() => [
      [
        {
          message: 'hello',
        },
      ],
    ]);

    await bigQueryClient.get();

    expect(querySpy).toHaveBeenCalledWith('select * from `test-table` as `table_0` limit 20');
  });

  it('should build a query to get data where a where clause', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
    });
    const querySpy = jest.spyOn(bigQueryClient, 'sendQuery').mockImplementation(() => [
      [
        {
          message: 'hello',
        },
      ],
    ]);

    await bigQueryClient.get({
      where: {
        id: 'foobar',
      },
    });

    expect(querySpy).toHaveBeenCalledWith(
      "select * from `test-table` as `table_0` where `table_0`.`id` = 'foobar' limit 20"
    );
  });

  it('should build a query to get data where a page and pageSize clause', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
    });
    const querySpy = jest.spyOn(bigQueryClient, 'sendQuery').mockImplementation(() => [
      [
        {
          message: 'hello',
        },
      ],
    ]);

    await bigQueryClient.get({
      where: {
        id: 'foobar',
      },
      page: 3,
      pageSize: 30,
    });

    expect(querySpy).toHaveBeenCalledWith(
      "select * from `test-table` as `table_0` where `table_0`.`id` = 'foobar' limit 30 offset 60"
    );
  });

  it('should build a query to get data with joins', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
      joins: [
        {
          table: 'other-table',
          on: ['test-table-id', 'other-table-id'],
        },
      ],
    });
    const querySpy = jest.spyOn(bigQueryClient, 'sendQuery').mockImplementation(() => [
      [
        {
          message: 'hello',
        },
      ],
    ]);

    await bigQueryClient.get({
      where: {
        my_id: 'foobar',
      },
      page: 3,
      pageSize: 30,
    });

    expect(querySpy).toHaveBeenCalledWith(
      "select * from `test-table` as `table_0` left join `other-table` as `table_1` on `table_0`.`test-table-id` = `table_1`.`other-table-id` where `table_0`.`my_id` = 'foobar' limit 30 offset 60"
    );
  });

  it('should build a query to get data with joins', async () => {
    const bigQueryClient = new BigQuery({
      table: 'test-table',
      joins: [
        {
          table: 'other-table',
          on: ['test-table-id', 'other-table-id'],
        },
      ],
    });
    const querySpy = jest.spyOn(bigQueryClient, 'sendQuery').mockImplementation(() => [
      [
        {
          message: 'hello',
        },
      ],
    ]);

    await bigQueryClient.get({
      where: {
        my_id: 'foobar',
      },
      page: 3,
      pageSize: 30,
      selection: 'name',
    });

    expect(querySpy).toHaveBeenCalledWith(
      "select `name` from `test-table` as `table_0` left join `other-table` as `table_1` on `table_0`.`test-table-id` = `table_1`.`other-table-id` where `table_0`.`my_id` = 'foobar' limit 30 offset 60"
    );
  });
});
