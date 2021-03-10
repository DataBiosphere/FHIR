const { dedupeObjects, buildOrderBy } = require('.');

describe('Utils tests', () => {
  it('should remove duplicate objects', () => {
    expect(
      dedupeObjects([
        {
          foo: 'bar',
        },
        {
          another: 'message',
          foo: 'bar',
        },
        {
          foo: 'bar',
        },
      ])
    ).toEqual([
      {
        foo: 'bar',
      },
      {
        another: 'message',
        foo: 'bar',
      },
    ]);
  });

  it('should does not remove any objects', () => {
    expect(
      dedupeObjects([
        {
          foo: 'bar',
        },
        {
          another: 'message',
          foo: 'bar',
        },
        {
          fooz: 'barz',
        },
      ])
    ).toEqual([
      {
        foo: 'bar',
      },
      {
        another: 'message',
        foo: 'bar',
      },
      {
        fooz: 'barz',
      },
    ]);
  });

  it('should CSV into KNEX orderBy object', () => {
    expect(buildOrderBy()).toEqual(null);

    expect(buildOrderBy('foo, bar, -foobar', (str) => {
      switch (str) {
        case 'foo':
          return [{ field: 'bar' }];
        case 'bar':
          return [{ field: 'foo' }];
        case 'foobar':
          return [{ field: 'foobar' }];
      }
    })).toEqual([
      { column: 'bar', order: 'asc' },
      { column: 'foo', order: 'asc' },
      { column: 'foobar', order: 'desc' },
    ]);
  });
});
