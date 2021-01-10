const { makeResource } = require('./metadata');

describe('Specimen metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server does not let clients create Specimens',
      profile: { reference: 'http://www.hl7.org/fhir/Specimen.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [],
      searchRevInclude: [],
      type: 'Specimen',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
