const { makeResource } = require('./metadata');

describe('Observation metadata test', () => {
  it('should have correct metadata ', () => {
    expect(makeResource()).toEqual({
      conditionalCreate: false,
      conditionalDelete: 'not-supported',
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      documentation: 'This server does not let clients create Observations',
      profile: { reference: 'http://www.hl7.org/fhir/Observation.profile.json' },
      readHistory: false,
      searchInclude: [],
      searchParam: [
        {
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        },
      ],
      searchRevInclude: [],
      type: 'Observation',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
