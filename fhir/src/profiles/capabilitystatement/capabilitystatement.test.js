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
      date: '20210315',
      contact: [
        {
          name: 'Asymmetrik, Ltd.',
          telecom: [
            {
              system: 'email',
              value: 'info@asymmetrik.com',
              use: 'work',
            },
            {
              system: 'phone',
              value: '(443) 470-6480',
              use: 'work',
            },
          ],
        },
      ],
      fhirVersion: '4_0_0',
      format: ['application/fhir+json'],
      implementation: { description: 'Broad FHIR Server' },
      kind: 'instance',
      publisher: 'Asymmetrik, Ltd.',
      resourceType: 'CapabilityStatement',
      rest: [
        {
          searchParam: [
            {
              name: '_count',
              definition: 'https://www.hl7.org/fhir/search.html#count',
              type: 'number',
            },
            { name: '_id', type: 'token', documentation: 'Standard _id parameter' },
          ],
          mode: 'server',
        },
      ],
      software: { name: 'Broad', releaseDate: '20201013', version: '2.0.0' },
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
          url: 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',
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
        },
      ],
    });
  });
  it('', () => {
    expect(typeof generateStatement().makeStatement).toEqual('function');
    expect(typeof generateStatement().securityStatement).toEqual('function');
  });
});
