const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Specimen = resolveSchema('4_0_0', 'Specimen');
const ResearchStudy = resolveSchema('4_0_0', 'ResearchStudy');

const WORKSPACE = 'Workspace';

class Translator {
  toResearchStudy(project) {
    return new ResearchStudy({
      id: 'test',
      title: 'test',
      status: 'administratively-completed',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              code: 'GE',
              display: 'Genetics',
            },
          ],
        },
      ],
    });
  }
}

module.exports = Translator;
