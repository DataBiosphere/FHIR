const { makeResource } = require('./metadata');

describe('DiagnosticReport metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server not not let clients create DiagnosticReports',
      profile: { reference: 'http://www.hl7.org/fhir/DiagnosticReport.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [],
      searchRevInclude: [],
      type: 'DiagnosticReport',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});