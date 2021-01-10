module.exports = {
  makeResource: () => {
    return {
      type: 'Specimen',
      profile: {
        reference: 'http://www.hl7.org/fhir/Specimen.profile.json',
      },
      documentation: 'This server does not let clients create Specimens',
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
