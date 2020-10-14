module.exports = {
  makeResource: () => {
    return {
      type: 'MolecularSequence',
      profile: {
        reference: 'http://www.hl7.org/fhir/molecularsequence.profile.json',
      },
      documentation: 'This server not not let clients create MolecularSequences',
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
