const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const {
  buildReference,
  buildIdentifier,
  buildCodeableConcept,
  buildCoding,
  buildOrderBy,
} = require('../utils');
const { QueryBuilder } = require('.');

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

  observationFieldResolver(field) {
    switch (field) {
      case 'id':
        return { type: 'token', fields: [{ field: 'diag__treat__treatment_id' }] };
      case 'subject':
        return { type: 'reference', fields: [{ field: 'submitter_id', tableAlias: 'table_1' }] };
      case 'code':
        return { type: 'token', fields: [{ field: 'diag__treat__treatment_type' }] };
      case 'identifier':
        return { type: 'token', fields: [{ field: 'proj__project_id' }] };
      default:
        return {};
    }
  }

  observationValueResolver(field, value) {
    switch (field) {
      case 'id':
        return [{ field: 'diag__treat__treatment_id', value: value }];
      case 'subject':
        return [{ field: 'submitter_id', value: value }];
      case 'code':
        return [{ field: 'diag__treat__treatment_type', value: value }];
      case 'identifier':
        return [{ field: 'proj__project_id', value: value }];
      default:
        return [];
    }
  }

  toObservationOrderBy(sortFields) {
    return buildOrderBy(sortFields, this.observationFieldResolver);
  }

  toObservationSearch(searchFields) {
    return this.makeSearch(searchFields, this.observationFieldResolver, this.observationValueResolver);
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

  diagnosticReportFieldResolver(field) {
    switch (field) {
      case 'id':
        return { type: 'token', fields: [{ field: 'case_id' }] };
      case 'subject':
        return { type: 'reference', fields: [{ field: 'demo__demographic_id' }] };
      case 'issued':
        return { type: 'date', fields: [{ field: 'updated_datetime' }] };
      case 'effectiveDateTime':
        return { type: 'date', fields: [{ field: 'updated_datetime' }] };
      default:
        return [];
    }
  }

  diagnosticReportValueResolver({ field = '', value = undefined } = {}) {
    switch (field) {
      case 'id':
        return [{ field: 'case_id', value: value }];
      case 'subject':
        return [{ field: 'demo__demographic_id', value: value }];
      case 'issued':
        return [{ field: 'updated_datetime', value: value }];
      case 'effectiveDateTime':
        return [{ field: 'updated_datetime', value: value }];
      default:
        return [];
    }
  }

  toDiagnosticReportOrderBy(sortFields) {
    return buildOrderBy(sortFields, this.diagnosticReportFieldResolver);
  }

  toDiagnosticReportSearch(searchFields) {
    return this.makeSearch(searchFields, this.diagnosticReportFieldResolver, this.diagnosticReportValueResolver);
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

  specimenFieldResolver(field) {
    switch (field) {
      case 'id':
        return { type: 'token', fields: [{ field: 'sample_gdc_id' }] };
      case 'identifier':
        return { type: 'token', fields: [{ field: 'project_short_name' }, { field: 'sample_gdc_id' }] };
      case 'subject':
        return { type: 'reference', fields: [{ field: 'case_gdc_id' }] };
      default:
        return [];
    }
  }

  specimenValueResolver({ field = '', value = undefined } = {}) {
    const translateIdentifier = (f, v) => {
      if (v === undefined) {
        return undefined;
      }

      const split = v.split('|');
      if (split.length < 3) {
        return undefined;
      }

      if (f === 'project_short_name') {
        return v[1];
      } else {
        return v[2];
      }
    };

    switch (field) {
      case 'id':
        return [{ field: 'sample_gdc_id', value: value }];
      case 'identifier':
        return [{ field: 'project_short_name', value: translateIdentifier(value) }, { field: 'sample_gdc_id', value: translateIdentifier(value) }];
      case 'subject':
        return [{ field: 'case_gdc_id', value: value }];
      default:
        return [];
    }
  }

  toSpecimenOrderBy(sortFields) {
    return buildOrderBy(sortFields, this.specimenFieldResolver);
  }

  toSpecimenSearch(searchFields) {
    return this.makeSearch(searchFields, this.specimenFieldResolver, this.specimenValueResolver);
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

  researchStudyFieldResolver(field) {
    switch (field) {
      case 'id':
      case 'identifier':
        return { type: 'token', fields: [{ field: 'proj__project_id' }] };
      case 'title':
        return { type: 'string', fields: [{ field: 'proj__name' }] };
      default:
        return [];
    }
  }

  researchStudyValueResolver({ field = '', value = undefined } = {}) {
    switch (field) {
      case 'id':
      case 'identifier':
        return [{ field: 'proj__project_id', value: value }];
      case 'title':
        return [{ field: 'proj__name', value: value }];
      default:
        return [];
    }
  }

  toResearchStudyOrderBy(sortFields) {
    return buildOrderBy(sortFields, this.researchStudyFieldResolver);
  }

  toResearchStudySearch(searchFields) {
    return this.makeSearch(searchFields, this.researchStudyFieldResolver, this.researchStudyValueResolver);
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

  patientFieldResolver(field) {
    switch (field) {
      case 'id':
        return { type: 'token', fields: [{ field: 'submitter_id' }] };
      case 'identifier':
        return { type: 'token', fields: [{ field: 'proj__project_id' }] };
      case 'gender':
        return { type: 'token', fields: [{ field: 'demo__gender' }] };
      default:
        return [];
    }
  }

  patientValueResolver({ field = '', value = undefined } = {}) {
    switch (field) {
      case 'id':
        return [{ field: 'submitter_id', value: value }];
      case 'identifier':
        return [{ field: 'proj__project_id', value: value }];
      case 'gender':
        return [{ field: 'demo__gender', value: value }];
      default:
        return [];
    }
  }

  // TODO: reduce this with ResearchStudy sort params
  toPatientOrderBy(sortFields) {
    return buildOrderBy(sortFields, this.patientFieldResolver);
  }

  toPatientSearch(searchFields) {
    return this.makeSearch(searchFields, this.patientFieldResolver, this.patientValueResolver);
  }

  // TODO: remove this at some point
  makeNCIP(resourceType, projectName, id) {
    return `${resourceType}|${projectName}|${id}`;
  }

  makeSearch(fields, fieldResolver, valueResolver){
    const searchBuilder = new QueryBuilder(fieldResolver, valueResolver);

    for (const field in fields) {
      searchBuilder.add({ field: field, value: fields[field] });
    }

    return searchBuilder.buildWhere();
  }
}

module.exports = Translator;
