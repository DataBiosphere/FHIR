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
      searchParam: [
        {
          name: "identifier",
          definition: "http://hl7.org/fhir/SearchParameter/Patient-identifier",
          type: "token",
          documentation: "A patient identifier"
        },
        {
          name: "gender",
          definition: "http://hl7.org/fhir/SearchParameter/individual-gender",
          type: "token",
          documentation: "Gender of the patient"
        }
      ],
      searchRevInclude: [],
      type: 'Patient',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
