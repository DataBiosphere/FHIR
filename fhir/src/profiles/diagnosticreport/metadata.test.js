const { makeResource } = require('./metadata');

describe('DiagnosticReport metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server does not let clients create DiagnosticReports',
      profile: { reference: 'http://www.hl7.org/fhir/DiagnosticReport.profile.json' },
      readHistory: false,
      searchInclude: [
        // 'DiagnosticReport:result'
      ],
      searchRevInclude: [],
      searchParam: [
        {
          name: 'subject',
          definition: 'http://hl7.org/fhir/SearchParameter/DiagnosticReport-subject',
          type: 'reference',
          documentation: 'A reference to the subject of the report',
        },
      ],
      type: 'DiagnosticReport',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
