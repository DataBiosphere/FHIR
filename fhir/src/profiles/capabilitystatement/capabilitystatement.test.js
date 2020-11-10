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
    expect(
      securityStatement([
        {
          url: 'authorize',
          valueUri: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        {
          url: 'token',
          valueUri: 'https://oauth2.googleapis.com/token',
        },
      ])
    ).toEqual({
      cors: true,
      service: [
        {
          coding: [
            {
              system: 'http://hl7.org/fhir/restful-security-service',
              code: 'SMART-on-FHIR',
              display: 'SMART-on-FHIR',
            },
          ],
          text: 'OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)',
        },
      ],
      extension: [
        {
          url: 'authorize',
          valueUri: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        {
          url: 'token',
          valueUri: 'https://oauth2.googleapis.com/token',
        },
      ],
    });
  });
  it('', () => {
    expect(typeof generateStatement().makeStatement).toEqual('function');
    expect(typeof generateStatement().securityStatement).toEqual('function');
  });
});
