const {
  buildLinkFromUrl,
  getLinks,
  buildSearchBundle,
  buildReference,
  buildIdentifier,
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
