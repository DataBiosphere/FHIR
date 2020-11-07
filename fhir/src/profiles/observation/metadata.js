module.exports = {
  makeResource: () => {
    return {
      type: 'Observation',
      profile: {
        reference: 'http://www.hl7.org/fhir/Observation.profile.json',
      },
      documentation: 'This server not not let clients create Observations',
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
