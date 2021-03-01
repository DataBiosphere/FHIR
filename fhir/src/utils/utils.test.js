const {
  TCGA_SOURCE,
  getLinks,
  buildLinkFromUrl,
  buildSearchBundle,
  buildEntry,
  buildIdentifier,
  buildCodeableConcept,
  buildReference,
  findDiseaseCodes,
  findDiseaseSystem,
  findDiseaseDisplay,
  buildSlug,
  buildCoding,
  buildCompareFn,
  mergeResults,
} = require('.');

describe('Utils tests', () => {
  it('should build links from URL', () => {
    expect(buildLinkFromUrl('self', new URL('https://example.com/'))).toEqual({
      relation: 'self',
      url: 'https://example.com/',
    });
  });

  it('should get FHIR links from a url, page, and page size', () => {
    const baseUrl = 'https://example.com';
    const resourceType = 'Patient';
    const page = 2;
    const pageSize = 20;
    const hashes = {
      prev: '1234',
      next: 'e12e540bc07c21be8a51b017d2cd5796',
    };
    expect(getLinks({ baseUrl, resourceType, page, pageSize })).toEqual([
      { relation: 'previous', url: 'https://example.com/Patient?_page=1&_count=20' },
      { relation: 'self', url: 'https://example.com/Patient?_page=2&_count=20' },
      { relation: 'next', url: 'https://example.com/Patient?_page=3&_count=20' },
    ]);

    expect(getLinks({ baseUrl, resourceType, page, pageSize, hashes })).toEqual([
      { relation: 'previous', url: 'https://example.com/Patient?_page=1&_hash=1234&_count=20' },
      { relation: 'self', url: 'https://example.com/Patient?_page=2&_count=20' },
      {
        relation: 'next',
        url: 'https://example.com/Patient?_page=3&_hash=e12e540bc07c21be8a51b017d2cd5796&_count=20',
      },
    ]);

    expect(getLinks({ baseUrl, resourceType, page: 1, pageSize })).toEqual([
      { relation: 'self', url: 'https://example.com/Patient?_page=1&_count=20' },
      { relation: 'next', url: 'https://example.com/Patient?_page=2&_count=20' },
    ]);
  });

  it('should build search bundles', () => {
    const resources = [{ resourceType: 'DiagnosticReport' }, { resourceType: 'DiagnosticReport' }];
    const page = 2;
    const pageSize = 3;
    expect(
      buildSearchBundle({
        resources,
        page,
        pageSize,
      })
    );
  });

  it('should build an entry without a source', () => {
    const resource = { resourceType: 'ResearchStudy' };
    expect(buildEntry(resource)).toEqual({
      fullUrl: 'http://localhost:3000/4_0_0/ResearchStudy/undefined',
      resource: { resourceType: 'ResearchStudy' },
      search: { mode: 'match' },
    });
  });

  it('should build an entry with a params', () => {
    const resource = { resourceType: 'ResearchStudy' };
    const searchMode = 'match';
    const queryParams = { _source: TCGA_SOURCE, test: 'test', foo: 'bar' };
    expect(buildEntry(resource, searchMode, queryParams)).toEqual({
      fullUrl: `http://localhost:3000/4_0_0/ResearchStudy/undefined?_source=https%3A%2F%2Fportal.gdc.cancer.gov%2F&test=test&foo=bar`,
      resource: { resourceType: 'ResearchStudy' },
      search: { mode: 'match' },
    });
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

  it('should build a valid compare function', () => {
    const comparer = buildCompareFn('test');
    expect(comparer({ test: 'a' }, { test: 'b' })).toEqual(-1);

    const comparerDesc = buildCompareFn('-test');
    expect(comparerDesc({ test: 'a' }, { test: 'b' })).toEqual(1);

    const comparerSame = buildCompareFn('test');
    expect(comparerSame({ test: 'a' }, { test: 'a' })).toEqual(0);

    const comparerMultiple = buildCompareFn('test,test2');
    expect(comparerMultiple({ test: 'a', test2: 'b' }, { test: 'a', test2: 'a' })).toEqual(1);

    const comparerMultipleDesc = buildCompareFn('test,-test2');
    expect(comparerMultipleDesc({ test: 'a', test2: 'b' }, { test: 'a', test2: 'a' })).toEqual(-1);
  });

  it('should merge results correctly', () => {
    const comparer = buildCompareFn('test');
    const array1 = [{ test: 'a' }, { test: 'b' }];
    const array2 = [{ test: 'c' }];
    expect(mergeResults(comparer, 1, array1, array2)).toEqual([[{ test: 'a' }], [1, 0]]);

    expect(mergeResults(comparer, 3, array1, array2)).toEqual([
      [{ test: 'a' }, { test: 'b' }, { test: 'c' }],
      [2, 1],
    ]);

    expect(mergeResults(comparer, 2, array1, array2)).toEqual([
      [{ test: 'a' }, { test: 'b' }],
      [2, 0],
    ]);

    expect(mergeResults(comparer, 2, array2, array1)).toEqual([
      [{ test: 'a' }, { test: 'b' }],
      [0, 2],
    ]);
  });
});
