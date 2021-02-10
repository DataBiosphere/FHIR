const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Specimen = resolveSchema('4_0_0', 'Specimen');
const ResearchStudy = resolveSchema('4_0_0', 'ResearchStudy');

const WORKSPACE = 'Workspace';

const buildReference = (reference, type, display) => {
  return {
    reference: reference,
    type: type,
    display: display,
  };
};

const buildIdentifier = (system, value) => {
  return {
    system: system,
    value: value,
  };
};

class Translator {
  toResearchStudy(workspace) {
    const researchStudy = new ResearchStudy({
      id: workspace.name,
      title: workspace.datasetName,
      status: 'completed',
      identifier: buildIdentifier(
        'https://anvil.terra.bio/#workspaces/anvil-datastorage/',
        workspace.name
      ),
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

    // if study has institute
    if (workspace.institute) {
      let institute = workspace.institute;

      // if it is an array, we extract it
      if (Array.isArray(institute)) {
        institute = institute[0];
      }

      researchStudy.sponsor = buildReference(
        `Organization/${institute}`,
        'Organization',
        institute
      );
    }

    // if study has a PI
    if (workspace.studyPi) {
      researchStudy.principalInvestigator = buildReference(
        `Practitioner/${workspace.studyPi}`,
        'Practitioner',
        workspace.studyPi
      );
    }

    return researchStudy;
  }
}

module.exports = Translator;
