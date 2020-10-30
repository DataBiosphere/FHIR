const { dedupeObjects } = require('.');

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

  it('should not not remove any objects', () => {
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
});
