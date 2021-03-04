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
      searchParam: [{
        name: "identifier",
        definition: "http://hl7.org/fhir/SearchParameter/ResearchStudy-identifier",
        type: "token",
        documentation: "Identifier for study"
      },
      {
        name: "title",
        definition: "http://hl7.org/fhir/SearchParameter/ResearchStudy-title",
        type: "string",
        documentation: "Title for this study"
      }],
    };
  },
};
