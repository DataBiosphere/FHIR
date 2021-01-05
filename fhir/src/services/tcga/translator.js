const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');

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
      resourceType: 'Observation',
      id: diagnosis.diag__treat__treatment_id,
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${diagnosis.diag__treat__treatment_type}</div>`,
      },
      meta: {
        versionId: diagnosis.diag__treat__treatment_id,
        source: gdcResult.proj__project_id,
        profile: ['https://www.hl7.org/fhir/observation.html'],
      },
      code: buildCodeableConcept(codes, text),
      issued: gdcResult.diag__treat__updated_datetime,
      effectiveDateTime: gdcResult.diag__treat__updated_datetime,
      status: 'final',
    });
  }

  toDiagnosticReport(tcgaResult) {
    return new DiagnosticReport({
      resourceType: 'DiagnosticReport',
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
            reference: 'ResearchStudy/TCGA',
            type: 'ResearchStudy',
          },
        },
      ],
    });
  }

  toSpecimen() {}
}

module.exports = Translator;