module.exports = {
  makeResource: () => {
    return {
      type: 'Patient',
      profile: {
        reference: 'http://www.hl7.org/fhir/Patient.profile.json',
      },
      documentation: 'This server does not let clients create Patients',
      versioning: 'no-version',
      readHistory: false,
      updateCreate: false,
      conditionalCreate: false,
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      conditionalDelete: 'not-supported',
      searchInclude: [],
      searchRevInclude: [],
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
    };
  },
};
