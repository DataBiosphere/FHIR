const { dedupeObjects, transformGdcResults, buildOrderBy } = require('../utils');
const { BigQuery } = require('../services');
const Translator = require('../services/translator');

// table constants
const GDC_TABLE = 'isb-cgc-bq.TCGA.clinical_gdc_current';
const DIAGNOSIS_TABLE = 'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current';
const BIOSPECIMEN_TABLE = 'isb-cgc-bq.TCGA.biospecimen_gdc_current';

// identifier constants
const CASE_IDENTIFIER = 'case_id';
const DIAGNOSIS_IDENTIFIER = 'diag__diagnosis_id';
const BIOSPECIMEN_IDENTIFIER = 'sample_gdc_id';
const PROJECT_IDENTIFIER = 'proj__project_id';
const PATIENT_IDENTIFIER = 'submitter_id';

const resourceTranslator = new Translator();

const ClinicalGDCRawService = new BigQuery({
  table: GDC_TABLE,
  primaryKey: CASE_IDENTIFIER,
});

const ClinicalGDCService = new BigQuery({
  table: GDC_TABLE,
  primaryKey: CASE_IDENTIFIER,
  joins: [
    {
      table: DIAGNOSIS_TABLE,
      on: [CASE_IDENTIFIER, CASE_IDENTIFIER],
    },
    {
      table: BIOSPECIMEN_TABLE,
      on: [CASE_IDENTIFIER, 'case_gdc_id'],
    },
  ],
});

const DiagnosisService = new BigQuery({
  table: DIAGNOSIS_TABLE,
  primaryKey: DIAGNOSIS_IDENTIFIER,
  joins: [
    {
      table: GDC_TABLE,
      on: [CASE_IDENTIFIER, CASE_IDENTIFIER],
    },
  ],
});

const BiospecimenService = new BigQuery({
  table: BIOSPECIMEN_TABLE,
  primaryKey: BIOSPECIMEN_IDENTIFIER,
  joins: [
    {
      table: GDC_TABLE,
      on: ['case_gdc_id', CASE_IDENTIFIER],
    },
  ],
});

/**
 * Convert a BigQuery results set to an organized model by caseID -> diagnoses|biospecimens
 * @param {array} rows
 */
const transformGdcRows = (rows) => {
  const caseIdMappings = rows.map(transformGdcResults).reduce((accum, ele) => {
    if (!accum[ele.case_id]) {
      accum[ele.case_id] = ele;
    } else {
      const { diagnoses, biospecimen } = ele;
      const { diagnoses: caseDiagnoses, biospecimen: caseBiospecimen } = accum[ele.case_id];
      accum[ele.case_id].diagnoses = dedupeObjects(diagnoses.concat(caseDiagnoses));
      accum[ele.case_id].biospecimen = dedupeObjects(biospecimen.concat(caseBiospecimen));
    }
    return accum;
  }, {});
  return Object.keys(caseIdMappings).map((caseId) => {
    const entry = caseIdMappings[caseId];
    return resourceTranslator.toDiagnosticReport({
      ...entry.current,
      diagnoses: entry.diagnoses,
      biospecimen: entry.biospecimen,
    });
  });
};

/**
 * getAll Diagnostic Report data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllDiagnosticReports = async ({
  _page = 1,
  _count = 20,
  _sort = '',
  _offset = 0,
} = {}) => {
  const [caseIds] = await ClinicalGDCRawService.get({
    selection: [CASE_IDENTIFIER],
    page: _page,
    count: _count,
    orderBy: resourceTranslator.toDiagnosticReportOrderBy(_sort),
    offset: _offset,
  });

  const [rows, count] = await ClinicalGDCService.get({
    whereIn: [CASE_IDENTIFIER, caseIds.map((row) => row.case_id)],
    orderBy: resourceTranslator.toDiagnosticReportOrderBy(_sort),
  });

  return [transformGdcRows(rows), count];
};

/**
 * Get Diagnostic Report data by an ID
 * @param {string} id
 */
const getDiagnosticReportById = async (id) => {
  const [rows] = await ClinicalGDCService.get({ where: { case_id: id } });

  return rows && rows.length ? transformGdcRows(rows)[0] : null;
};

/**
 * getAll Observation data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllObservations = async ({ _page = 1, _count = 20, _sort = '', _offset = 0 } = {}) => {
  const [rows, count] = await DiagnosisService.get({
    page: _page,
    count: _count,
    orderBy: resourceTranslator.toObservationOrderBy(_sort),
    offset: _offset,
  });

  return [rows.map((row) => resourceTranslator.toObservation(row)), count];
};

/**
 * Get Observation data by an ID
 * @param {string} id
 */
const getObservationById = async (id) => {
  const [rows] = await DiagnosisService.get({ where: { diag__treat__treatment_id: id } });

  return rows && rows.length ? resourceTranslator.toObservation(rows[0]) : null;
};

/**
 * getAll Specimen data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllSpecimen = async ({ _page = 1, _count = 20, _sort = '', _offset = 0 } = {}) => {
  const [rows, count] = await BiospecimenService.get({
    page: _page,
    count: _count,
    orderBy: resourceTranslator.toSpecimenOrderBy(_sort),
    offset: _offset,
  });

  return [rows.map((row) => resourceTranslator.toSpecimen(row)), count];
};

/**
 * Get Specimen data by an ID
 * @param {string} id
 */
const getSpecimenById = async (id) => {
  const [rows] = await BiospecimenService.get({ where: { sample_gdc_id: id } });

  return rows && rows.length ? resourceTranslator.toSpecimen(rows[0]) : null;
};

/**
 * getAll Research Study data by _page and _count
 * @param {number=} [_page]
 * @param {number=} [_count]
 * @param {string=} [_sort]
 * @param {number=} [_offset]
 */
const getAllResearchStudies = async ({ _page = 1, _count = 20, _sort = '', _offset = 0 } = {}) => {
  const [rows, count] = await ClinicalGDCRawService.get({
    selection: ['proj__name', PROJECT_IDENTIFIER],
    distinct: true,
    page: _page,
    count: _count,
    orderBy: resourceTranslator.toResearchStudyOrderBy(_sort),
    offset: _offset,
  });

  return [rows.map((row) => resourceTranslator.toResearchStudy(row)), count];
};

/**
 * Get Research Study data by an ID
 * @param {string} id
 */
const getResearchStudyById = async (id) => {
  const [rows] = await ClinicalGDCRawService.get({ where: { [PROJECT_IDENTIFIER]: id } });

  return rows && rows.length ? resourceTranslator.toResearchStudy(rows[0]) : null;
};

/**
 * getAll Patient data by _page and _count
 * @param {number=} [_page]
 * @param {number=} [_count]
 * @param {string=} [_sort]
 * @param {number=} [_offset]
 */
const getAllPatients = async ({ _page = 1, _count = 20, _sort = '', _offset = 0 } = {}) => {
  const [rows, count] = await ClinicalGDCRawService.get({
    page: _page,
    count: _count,
    orderBy: resourceTranslator.toPatientOrderBy(_sort),
    offset: _offset,
  });

  return [rows.map((row) => resourceTranslator.toPatient(row)), count];
};

/**
 * Get Project data by an ID
 * @param {string} id
 */
const getPatientById = async (id) => {
  const [rows] = await ClinicalGDCRawService.get({ where: { [PATIENT_IDENTIFIER]: id } });

  return rows && rows.length ? resourceTranslator.toPatient(rows[0]) : null;
};

module.exports = {
  getAllDiagnosticReports,
  getDiagnosticReportById,
  getAllObservations,
  getObservationById,
  getAllSpecimen,
  getSpecimenById,
  getAllResearchStudies,
  getResearchStudyById,
  getAllPatients,
  getPatientById,
};
