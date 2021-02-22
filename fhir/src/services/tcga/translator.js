const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const {
  buildReference,
  buildIdentifier,
  buildCodeableConcept,
  buildCoding,
  buildSortArray,
} = require('../../utils');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Specimen = resolveSchema('4_0_0', 'Specimen');
const ResearchStudy = resolveSchema('4_0_0', 'ResearchStudy');

const { observationCodeMappings, fieldMappings } = require('../../utils/tcgamappings');

const findTCGACodes = (testString) => {
  const found = observationCodeMappings.find(({ regex }) => regex.test(testString));

  if (found) {
    const { codes, text } = found;
    return { codes, text: text || testString };
  }
  return { text: testString };
};

class Translator {
  toObservation(diagnosis, gdcResult) {
    const { codes, text } = findTCGACodes(diagnosis.diag__treat__treatment_type);
    return new Observation({
      id: diagnosis.diag__treat__treatment_id,
      identifier: buildIdentifier(
        'https://portal.gdc.cancer.gov/projects/',
        gdcResult.proj__project_id,
        'official'
      ),
      meta: {
        profile: ['https://www.hl7.org/fhir/observation.html'],
        source: gdcResult.proj__project_id,
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
          coding: [buildCoding('GE', 'http://terminology.hl7.org/CodeSystem/v2-0074', 'Genetics')],
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
          coding: [buildCoding('GE', 'http://terminology.hl7.org/CodeSystem/v2-0074', 'Genetics')],
        },
      ],
      sponsor: buildReference(
        'Organization/The Cancer Genome Atlas',
        'Organization',
        'The Cancer Genome Atlas'
      ),
    });
  }

  toResearchStudySortParams(sortFields) {
    console.log(sortFields);
    const sortArray = buildSortArray(sortFields);
    const researchStudyMappings = fieldMappings.RESEARCHSTUDY;

    return sortArray.filter(sf => researchStudyMappings[sf.field])
                    .map(sf => `${(sf.multiplier === -1 ? '-' : '')}${researchStudyMappings[sf.field]}`)
                    .join(',');
  }

  // TODO: remove this at some point
  makeNCIP(resourceType, projectName, id) {
    return `${resourceType}|${projectName}|${id}`;
  }
}

module.exports = Translator;
