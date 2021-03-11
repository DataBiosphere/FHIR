const {
  dedupeObjects,
  buildOrderBy,
  buildIdentifier,
  buildReference,
  buildCodeableConcept,
  buildCoding,
} = require('.');

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

  it('should build an Identifier', () => {
    const system = 'sys';
    const value = 'val';

    expect(buildIdentifier(system, value)).toEqual({
      use: 'temp',
      system: 'sys',
      value: 'val',
    });
  });

  it('should build a CodeableConcept', () => {
    const code = 'code';
    const text = 'text';

    expect(buildCodeableConcept(code, text)).toEqual({
      coding: 'code',
      text: 'text',
    });
  });

  it('should build Coding', () => {
    const code = 'code';
    const system = 'system';
    const display = 'display';

    expect(buildCoding(code, system, display)).toEqual({
      system: 'system',
      code: 'code',
      display: 'display',
    });

    expect(buildCoding(code)).toEqual({
      code: 'code',
    });
  });

  it('should build a Reference', () => {
    const reference = 'ref';
    const type = 'type';
    const display = 'text';

    expect(buildReference(reference, type, display)).toEqual({
      reference: 'ref',
      type: 'type',
      display: 'text',
    });
  });
});
