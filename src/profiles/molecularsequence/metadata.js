module.exports = {
  makeResource: (args, logger) => {
    const _count = {
      name: '_count',
      type: 'number',
      fhirtype: 'number',
      definition: 'https://www.hl7.org/fhir/search.html#count',
      description: 'The amount of resources to return',
    };

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
