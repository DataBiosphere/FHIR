const {
  dedupeObjects,
  buildSortObject,
  buildCodeableConcept,
  buildIdentifier,
  buildCoding,
  buildReference,
  buildSlug,
  findDiseaseCodes,
  findDiseaseSystem,
  findDiseaseDisplay,
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

  it('should CSV into Mongo sort object', () => {
    expect(buildSortObject()).toEqual([{}, {}]);

    expect(buildSortObject('foo, bar, -foobar')).toEqual([
      { foo: 1, bar: 1, foobar: -1 },
      { foo: { $exists: true }, bar: { $exists: true }, foobar: { $exists: true } },
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

  it('should get (a an Lethal congenital contracture syndrome 11) encoding', () => {
    expect(findDiseaseCodes('-')).toBeNull();
    expect(findDiseaseCodes('test')).toEqual({
      code: 'test',
    });
    expect(findDiseaseCodes('OMIM:617194')).toEqual({
      system: 'http://purl.obolibrary.org/obo/omim.owl',
      code: 'OMIM:617194',
      display: 'Lethal congenital contracture syndrome 11',
    });
  });

  it('should get disease systems', () => {
    expect(findDiseaseSystem('-')).toBeNull();
    expect(findDiseaseSystem('DOID:3393')).toEqual('http://purl.obolibrary.org/obo/doid.owl');
    expect(findDiseaseSystem('/OMIM:615780/')).toEqual('http://purl.obolibrary.org/obo/omim.owl');
    expect(findDiseaseSystem('HPP')).toEqual('http://purl.obolibrary.org/obo/hp.owl');
  });

  it('should get disease displays', () => {
    expect(findDiseaseDisplay('-')).toBeNull();
    expect(findDiseaseDisplay('DOID:9744')).toEqual('type 1 diabetes mellitus');
    expect(findDiseaseDisplay('OMIM:607483')).toEqual(
      'THIAMINE METABOLISM DYSFUNCTION SYNDROME 2 (BIOTIN- OR THIAMINE-RESPONSIVE TYPE); THMD2'
    );
    expect(findDiseaseDisplay('OMIM:618512')).toEqual("O'DONNELL-LURIA-RODAN SYNDROME; ODLURO");
  });

  it('should build valid fhir id', () => {
    expect(buildSlug('/', '-', null, undefined, '')).toEqual('-');
    expect(buildSlug('abc', '123', '.', '-')).toEqual('abc-123-.--');

    const ten = '1234567890';
    expect(buildSlug(ten, ten, ten, ten, ten, ten, ten, '1')).toEqual(
      '1234567890-1234567890-1234567890-1234567890-1234567890-123456789'
    );
  });
});
