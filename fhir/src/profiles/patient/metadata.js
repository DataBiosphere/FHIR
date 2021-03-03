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
      searchParam: [],
    };
  },
};
