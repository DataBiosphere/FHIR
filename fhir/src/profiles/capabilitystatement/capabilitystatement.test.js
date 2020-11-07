const { makeStatement, securityStatement, generateStatement } = require('.');

describe('CapabilityStatement tests', () => {
  it('', () => {
    const resources = [
      {
        type: 'DiagnosticReport',
        profile: {
          reference: 'http://www.hl7.org/fhir/DiagnosticReport.profile.json',
        },
        documentation: 'This server does not let clients create DiagnosticReports',
        interaction: [
          {
            code: 'search-type',
          },
        ],
        versioning: 'no-version',
        readHistory: false,
        updateCreate: false,
        conditionalCreate: false,
        conditionalRead: 'not-supported',
        conditionalUpdate: false,
        conditionalDelete: 'not-supported',
        searchInclude: [],
        searchRevInclude: [],
        searchParam: [],
      },
    ];
    expect(JSON.parse(JSON.stringify(makeStatement(resources)))).toEqual({
      date: '20201013',
      fhirVersion: '4_0_0',
      format: ['application/fhir+json'],
      implementation: { description: 'Broad FHIR Server' },
      kind: 'instance',
      publisher: 'The Publisher',
      resourceType: 'CapabilityStatement',
      rest: [
        {
          searchParam: [
            {
              definition: 'https://www.hl7.org/fhir/search.html#count',
              name: '_count',
              type: 'number',
            },
          ],
        },
      ],
      software: { name: 'Broad', releaseDate: '20201013', version: '1.0.0' },
      status: 'draft',
    });
  });
  it('', () => {
    expect(securityStatement()).toEqual({
      cors: true,
      extension: [
        {
          extension: undefined,
          url: 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',
        },
      ],
      service: [
        {
          coding: [
            { code: 'SMART-on-FHIR', system: 'http://hl7.org/fhir/restful-security-service' },
          ],
          text: 'Custom OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)',
        },
      ],
    });
  });
  it('', () => {
    expect(typeof generateStatement().makeStatement).toEqual('function');
    expect(typeof generateStatement().securityStatement).toEqual('function');
  });
});
