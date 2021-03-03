const { makeResource } = require('./metadata');

describe('Patient metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server does not let clients create Patients',
      profile: { reference: 'http://www.hl7.org/fhir/Patient.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [],
      searchRevInclude: [],
      type: 'Patient',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
