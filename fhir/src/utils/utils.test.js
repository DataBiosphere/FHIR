const {
  TCGA_SOURCE,
  getLinks,
  buildLinkFromUrl,
  buildSearchBundle,
  buildEntry,
  buildCompareFn,
  mergeResults,
} = require('.');

const LOCAL_URL = process.env.URL;

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
      fullUrl: `${LOCAL_URL}/ResearchStudy/undefined`,
      resource: { resourceType: 'ResearchStudy' },
      search: { mode: 'match' },
    });
  });

  it('should build an entry with a params', () => {
    const resource = { resourceType: 'ResearchStudy' };
    const searchMode = 'match';
    const queryParams = { _source: TCGA_SOURCE, test: 'test', foo: 'bar' };
    expect(buildEntry(resource, searchMode, queryParams)).toEqual({
      fullUrl: `${LOCAL_URL}/ResearchStudy/undefined?_source=https%3A%2F%2Fportal.gdc.cancer.gov%2F&test=test&foo=bar`,
      resource: { resourceType: 'ResearchStudy' },
      search: { mode: 'match' },
    });
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
