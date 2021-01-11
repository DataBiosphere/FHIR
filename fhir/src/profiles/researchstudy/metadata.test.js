const { makeResource } = require('./metadata');

describe('Specimen metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server does not let clients create ResearchStudys',
      profile: { reference: 'http://www.hl7.org/fhir/ResearchStudy.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [],
      searchRevInclude: [],
      type: 'ResearchStudy',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
