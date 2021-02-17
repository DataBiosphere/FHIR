const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const { buildReference, buildIdentifier } = require('../../utils');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Specimen = resolveSchema('4_0_0', 'Specimen');
const ResearchStudy = resolveSchema('4_0_0', 'ResearchStudy');

const observationCodeMappings = [
  {
    regex: /Radiation Therapy/,
    codes: [
      {
        system: 'http://loinc.org/',
        code: '21880-0',
        display: 'Radiation treatment therapy Cancer',
      },
    ],
  },
  {
    regex: /Pharmaceutical Therapy, NOS/,
    text: 'Pharmaceutical Therapy, NOS',
  },
];

const buildCodeableConcept = (codes, text) => {
  return {
    coding: codes,
    text,
  };
};

const findCodes = (testString) => {
  const found = observationCodeMappings.find(({ regex }) => regex.test(testString));

  if (found) {
    const { codes, text } = found;
    return { codes, text: text || testString };
  }
  return { text: testString };
};

class Translator {
  toObservation(diagnosis, gdcResult) {
    const { codes, text } = findCodes(diagnosis.diag__treat__treatment_type);
    return new Observation({
      id: diagnosis.diag__treat__treatment_id,
      identifier: buildIdentifier(
        'https://portal.gdc.cancer.gov/projects/',
        diagnosis.proj__project_id
      ),
      meta: {
        profile: ['https://www.hl7.org/fhir/observation.html'],
        versionId: diagnosis.diag__treat__treatment_id,
      },
      status: 'final',
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${diagnosis.diag__treat__treatment_type}</div>`,
      },
      code: buildCodeableConcept(codes, text),
      issued: gdcResult.diag__treat__updated_datetime,
      effectiveDateTime: gdcResult.diag__treat__updated_datetime,
    });
  }

  toDiagnosticReport(tcgaResult) {
    return new DiagnosticReport({
      id: tcgaResult.case_id,
      meta: {
        versionId: tcgaResult.case_id,
        source: tcgaResult.proj__project_id,
        profile: 'https://www.hl7.org/fhir/diagnosticreport-genetics.html',
      },
      status: 'final',
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
      subject: {
        reference: `Patient/${tcgaResult.demo__demographic_id}`,
      },
      result: tcgaResult.diagnoses.map((diagnosis) => {
        return {
          reference: `Observation/${diagnosis.diag__treat__treatment_id}`,
          display: diagnosis.diag__treat__treatment_type,
        };
      }),

      issued: tcgaResult.updated_datetime,
      effectiveDatetime: tcgaResult.updated_datetime,
      extension: [
        {
          url: 'https://build.fhir.org/extension-workflow-researchstudy.html',
          valueReference: {
            reference: `ResearchStudy/${tcgaResult.proj__project_id}`,
            type: 'ResearchStudy',
          },
        },
      ],
    });
  }

  toSpecimen(biospecimen) {
    const sample_id = `${biospecimen.project_short_name}-${biospecimen.sample_gdc_id}`;
    // const subject_id = `${biospecimen.project_short_name}-${biospecimen.case_gdc_id}`;
    const ncpi = this.makeNCIP('Specimen', biospecimen.project_short_name, sample_id);

    return new Specimen({
      id: biospecimen.sample_gdc_id,
      meta: {
        profile: ['http://hl7.org/fhir/StructureDefinition/Specimen'],
      },
      identifier: [{ system: 'urn:ncpi:unique-string', value: ncpi }],
      subject: {
        reference: biospecimen.case_gdc_id,
      },
    });
  }

  toResearchStudy(project) {
    return new ResearchStudy({
      id: project.proj__project_id,
      identifier: buildIdentifier(
        'https://portal.gdc.cancer.gov/projects/',
        project.proj__project_id
      ),
      meta: {
        profile: ['https://www.hl7.org/fhir/researchstudy.html'],
      },
      title: project.proj__name,
      status: 'completed',
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
      sponsor: buildReference(
        'Organization/The Cancer Genome Atlas',
        'Organization',
        'The Cancer Genome Atlas'
      ),
    });
  }

  // TODO: remove this at some point
  makeNCIP(resourceType, projectName, id) {
    return `${resourceType}|${projectName}|${id}`;
  }
}

module.exports = Translator;
