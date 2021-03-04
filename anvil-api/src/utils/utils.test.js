const { dedupeObjects, buildSortObject } = require('.');

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

  it('should CSV into Mongo sort object', () => {
    expect(buildSortObject()).toEqual([{}, {}]);

    expect(buildSortObject('foo, bar, -foobar')).toEqual([
      { foo: 1, bar: 1, foobar: -1 },
      { foo: { $exists: true }, bar: { $exists: true }, foobar: { $exists: true } },
    ]);
  });
});
