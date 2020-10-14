const { makeResource } = require('./metadata');

describe('MolecularSequence metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server not not let clients create MolecularSequences',
      profile: { reference: 'http://www.hl7.org/fhir/molecularsequence.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [],
      searchRevInclude: [],
      type: 'MolecularSequence',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
