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
          name: "code",
          definition: "http://hl7.org/fhir/SearchParameter/clinical-code",
          type: "token",
          documentation: "The code of the observation type"
        },
        {
          name: "subject",
          definition: "http://hl7.org/fhir/SearchParameter/Observation-subject",
          type: "reference",
          documentation: "The subject that the observation is about"
        },
        {
          name: "identifier",
          definition: "http://hl7.org/fhir/SearchParameter/clinical-identifier",
          type: "token",
          documentation: "The unique id for a particular observation"
        },
        {
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        }
      ],
      searchRevInclude: [],
      type: 'Observation',
      updateCreate: false,
      versioning: 'no-version',
    });
  });
});
