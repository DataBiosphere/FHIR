const {
  buildLinkFromUrl,
  getLinks,
  buildSearchBundle,
  buildEntry,
  buildReference,
  buildIdentifier,
  TCGA_SOURCE,
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
    const page = 2;
    const pageSize = 20;
    expect(getLinks({ baseUrl, resourceType: 'Patient', page, pageSize })).toEqual([
      { relation: 'previous', url: 'https://example.com/Patient' },
      { relation: 'self', url: 'https://example.com/Patient?_page=2&_count=20' },
      { relation: 'next', url: 'https://example.com/Patient?_page=3&_count=20' },
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
      fullUrl: `http://localhost:3000/4_0_0/ResearchStudy/undefined?_source=${TCGA_SOURCE}&test=test&foo=bar`,
      resource: { resourceType: 'ResearchStudy' },
      search: { mode: 'match' },
    });
  });

  it('should build a reference', () => {
    const reference = 'ref';
    const type = 'type';
    const display = 'text';

    expect(buildReference(reference, type, display)).toEqual({
      reference: 'ref',
      type: 'type',
      display: 'text',
    });
  });

  it('should build a identifier', () => {
    const system = 'sys';
    const value = 'val';

    expect(buildIdentifier(system, value)).toEqual({
      system: 'sys',
      value: 'val',
    });
  });
});
