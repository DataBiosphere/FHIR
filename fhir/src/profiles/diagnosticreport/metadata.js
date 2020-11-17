module.exports = {
  makeResource: () => {
    return {
      type: 'DiagnosticReport',
      profile: {
        reference: 'http://www.hl7.org/fhir/DiagnosticReport.profile.json',
      },
      documentation: 'This server not not let clients create DiagnosticReports',
      versioning: 'no-version',
      readHistory: false,
      updateCreate: false,
      conditionalCreate: false,
      conditionalRead: 'not-supported',
      conditionalUpdate: false,
      conditionalDelete: 'not-supported',
      searchInclude: ['DiagnosticReport:result'],
      searchRevInclude: [],
      searchParam: [
        {
          name: 'researchStudy',
          definition: 'http://hl7.org/fhir/StructureDefinition/workflow-researchStudy',
          type: 'string',
        },
      ],
    };
  },
};
