module.exports = {
  makeResource: () => {
    return {
      type: 'ResearchStudy',
      profile: {
        reference: 'http://www.hl7.org/fhir/ResearchStudy.profile.json',
      },
      documentation: 'This server does not let clients create ResearchStudys',
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
    };
  },
};
