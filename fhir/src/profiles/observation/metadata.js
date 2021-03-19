module.exports = {
  makeResource: () => {
    return {
      type: 'Observation',
      profile: {
        reference: 'http://www.hl7.org/fhir/Observation.profile.json',
      },
      documentation: 'This server does not let clients create Observations',
      versioning: 'no-version',
      readHistory: false,
      updateCreate: false,
      conditionalCreate: false,
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      conditionalDelete: 'not-supported',
      searchInclude: [],
      searchRevInclude: [],
      searchParam: [
        {
          name: '_source',
          type: 'uri',
          documentation: 'URL of the source site. Currently only supports AnVIL and TCGA',
        },
        {
          name: 'identifier',
          definition: 'https://www.hl7.org/fhir/datatypes.html#Identifier',
          type: 'token',
          documentation: 'The unique id for a particular observation',
        },
        {
          name: 'code',
          definition: 'https://www.hl7.org/fhir/valueset-observation-codes.html',
          type: 'token',
          documentation: 'The clinical code of the observation type',
        },
        {
          name: 'subject',
          definition: 'https://www.hl7.org/fhir/observation-definitions.html#Observation.subject',
          type: 'reference',
          documentation: 'A reference to the subject of the observation',
        },
      ],
    };
  },
};
