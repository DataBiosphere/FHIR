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
        },
        {
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        }
      ],
    };
  },
};
