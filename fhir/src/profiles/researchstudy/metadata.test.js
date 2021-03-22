const { makeResource } = require('./metadata');

describe('ResearchStudy metadata test', () => {
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
      searchParam: [
        {
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        },
        {
          name: 'identifier',
          definition: 'http://hl7.org/fhir/researchstudy-definitions.html#ResearchStudy.identifier',
          type: 'token',
          documentation: 'The unique id for a particular research study',
        },
        {
          name: 'title',
          definition: 'http://hl7.org/fhir/researchstudy-definitions.html#ResearchStudy.title',
          type: 'string',
          documentation: 'The name of the study',
        },
      ],
      searchRevInclude: [],
      type: 'ResearchStudy',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
