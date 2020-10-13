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
        reference: 'http://hl7.org/fhir/molecularsequence.html',
      },
      searchParam: [_count],
    };
  },
};
