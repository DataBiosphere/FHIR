const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const {
  buildReference,
  buildIdentifier,
  buildCodeableConcept,
  buildCoding,
  buildOrderBy,
} = require('../utils');

const Observation = resolveSchema('4_0_0', 'Observation');
const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Specimen = resolveSchema('4_0_0', 'Specimen');
const ResearchStudy = resolveSchema('4_0_0', 'ResearchStudy');
const Patient = resolveSchema('4_0_0', 'Patient');

const { observationCodeMappings, tcgaFieldMappings } = require('../utils/mappings');

const findTCGACodes = (testString) => {
  const found = observationCodeMappings.find(({ regex }) => regex.test(testString));

  if (found) {
    const { codes, text } = found;
    return { codes, text: text || testString };
  }
  return { text: testString };
};

class Translator {
  toObservation(diagnosis) {
    const { codes, text } = findTCGACodes(diagnosis.diag__treat__treatment_type);
    return new Observation({
      id: diagnosis.diag__treat__treatment_id,
      identifier: buildIdentifier(
        'https://portal.gdc.cancer.gov/projects/',
        diagnosis.proj__project_id,
        'official'
      ),
      meta: {
        profile: ['https://www.hl7.org/fhir/observation.html'],
        source: diagnosis.proj__project_id,
        versionId: diagnosis.diag__treat__treatment_id,
      },
      status: 'final',
      subject: {
        reference: `Patient/${diagnosis.submitter_id}`,
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${diagnosis.diag__treat__treatment_type}</div>`,
      },
      code: buildCodeableConcept(codes, text),
      issued: diagnosis.diag__treat__updated_datetime,
      effectiveDateTime: diagnosis.diag__treat__updated_datetime,
    });
  }
  toObservationOrderBy(sortFields) {
    return buildOrderBy(sortFields, (field) => {
      switch (field) {
        case 'id':
          return [{ field: 'diag__treat__treatment_id' }];
        case 'subject':
          return [{ field: 'submitter_id', tableAlias: 'table_1' }];
        default:
          return [];
      }
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

  toDiagnosticReportOrderBy(sortFields) {
    return buildOrderBy(sortFields, (field) => {
      switch (field) {
        case 'id':
          return [{ field: 'case_id' }];
        case 'subject':
          return [{ field: 'demo__demographic_id' }];
        case 'issued':
          return [{ field: 'updated_datetime' }];
        case 'effectiveDateTime':
          return [{ field: 'updated_datetime' }];
        default:
          return [];
      }
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

  toSpecimenOrderBy(sortFields) {
    return buildOrderBy(sortFields, (field) => {
      switch (field) {
        case 'id':
          return [{ field: 'sample_gdc_id' }];
        case 'identifier':
          return [{ field: 'project_short_name' }, { field: 'sample_gdc_id' }];
        case 'subject':
          return [{ field: 'case_gdc_id' }];
        default:
          return [];
      }
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
  toResearchStudyOrderBy(sortFields) {
    return buildOrderBy(sortFields, (field) => {
      switch (field) {
        case 'id':
        case 'identifier':
          return [{ field: 'proj__project_id' }];
        case 'title':
          return [{ field: 'proj__name' }];
        default:
          return [];
      }
    });
  }

  toPatient(gdcResult) {
    const patient = new Patient({
      id: gdcResult.submitter_id,
      identifier: buildIdentifier(
        'https://portal.gdc.cancer.gov/projects/',
        gdcResult.proj__project_id
      ),
      meta: {
        profile: ['https://www.hl7.org/fhir/patient.html'],
      },
    });

    // translate gender value to code
    const GENDER_SYSTEM = 'http://hl7.org/fhir/administrative-gender';
    if (gdcResult.demo__gender) {
      let gender = gdcResult.demo__gender.toLowerCase();

      switch (gender) {
        case 'male':
          gender = buildCoding('male', GENDER_SYSTEM, 'Male');
          break;
        case 'female':
          gender = buildCoding('female', GENDER_SYSTEM, 'Female');
          break;
        default:
          gender = buildCoding('unknown', GENDER_SYSTEM, 'Unknown');
      }

      patient.gender = gender;
    } else {
      patient.gender = buildCoding('unknown', GENDER_SYSTEM, 'Unknown');
    }

    return patient;
  }
  // TODO: reduce this with ResearchStudy sort params
  toPatientOrderBy(sortFields) {
    return buildOrderBy(sortFields, (field) => {
      switch (field) {
        case 'id':
          return [{ field: 'submitter_id' }];
        case 'identifier':
          return [{ field: 'proj__project_id' }];
        case 'gender':
          return [{ field: 'demo__gender' }];
        default:
          return [];
      }
    });
  }

  // TODO: remove this at some point
  makeNCIP(resourceType, projectName, id) {
    return `${resourceType}|${projectName}|${id}`;
  }
}

module.exports = Translator;
