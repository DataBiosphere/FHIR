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
      'THIAMINE METABOLISM DYSFUNCTION SYNDROME 2 {BIOTIN- OR THIAMINE-RESPONSIVE TYPE}; THMD2'
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
