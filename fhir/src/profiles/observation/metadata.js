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
        }
      ],
    };
  },
};
