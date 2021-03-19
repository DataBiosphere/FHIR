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
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        },
        {
          name: 'identifier',
          definition: 'http://hl7.org/fhir/patient-definitions.html#Patient.identifier',
          type: 'token',
          documentation: 'The unique id for a particular patient',
        },
        {
          name: 'gender',
          definition: 'http://hl7.org/fhir/valueset-administrative-gender.html',
          type: 'token',
          documentation: 'The gender of the patient',
        },
      ],
      searchRevInclude: [],
      type: 'Patient',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
