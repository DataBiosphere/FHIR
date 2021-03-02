const { dedupeObjects, transformGdcResults, buildOrderBy } = require('../utils');
const { BigQuery } = require('../services');

// table constants
const GDC_TABLE = 'isb-cgc-bq.TCGA.clinical_gdc_current';
const DIAGNOSIS_TABLE = 'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current';
const BIOSPECIMEN_TABLE = 'isb-cgc-bq.TCGA.biospecimen_gdc_current';

// identifier constants
const CASE_IDENTIFIER = 'case_id';
const DIAGNOSIS_IDENTIFIER = 'diag__diagnosis_id';
const BIOSPECIMEN_IDENTIFIER = 'sample_gdc_id';
const PROJECT_IDENTIFIER = 'proj__project_id';
const PATIENT_IDENTIFIER = 'demo__demographic_id';

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

const PatientService = new BigQuery({
  table: GDC_TABLE,
  primaryKey: PATIENT_IDENTIFIER,
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
    return { ...entry.current, diagnoses: entry.diagnoses, biospecimen: entry.biospecimen };
  });
};

/**
 * getAll GDC data by page and pageSize
 * @param {string=} page
 * @param {string=} pageSize
 */
const getAllGdc = async ({ page = 1, pageSize = 20 }) => {
  const [caseIds] = await ClinicalGDCRawService.get({
    selection: [CASE_IDENTIFIER],
    page,
    pageSize,
  });

  const [rows, count] = await ClinicalGDCService.get({
    whereIn: [CASE_IDENTIFIER, caseIds.map((row) => row.case_id)],
  });

  return [transformGdcRows(rows), count];
};

/**
 * Get GDC data by an ID
 * @param {string} id
 */
const getGdcById = async (id) => {
  const [rows] = await ClinicalGDCService.get({ where: { case_id: id } });

  if (rows && rows.length) {
    return transformGdcRows(rows)[0];
  }
  return null;
};

/**
 * getAll Diagnosis data by page and pageSize
 * @param {string=} page
 * @param {string=} pageSize
 */
const getAllDiagnosis = async ({ page = 1, pageSize = 20 }) => {
  const [rows, count] = await DiagnosisService.get({ page, pageSize });

  return [rows, count];
};

/**
 * Get Diagnosis data by an ID
 * @param {string} id
 */
const getDiagnosisById = async (id) => {
  const [rows] = await DiagnosisService.get({ where: { diag__treat__treatment_id: id } });

  if (rows && rows.length) {
    return rows[0];
  }

  return null;
};

/**
 * getAll Biospecimen data by page and pageSize
 * @param {string=} page
 * @param {string=} pageSize
 */
const getAllBiospecimen = async ({ page = 1, pageSize = 20 }) => {
  const [rows, count] = await BiospecimenService.get({ page, pageSize });

  return [rows, count];
};

/**
 * Get Biospecimen data by an ID
 * @param {string} id
 */
const getBiospecimenById = async (id) => {
  const [rows] = await BiospecimenService.get({ where: { sample_gdc_id: id } });

  if (rows && rows.length) {
    return rows[0];
  }

  return null;
};

/**
 * getAll Project data by page and pageSize
 * @param {number=} [page]
 * @param {number=} [pageSize]
 * @param {string=} [sort]
 * @param {number=} [offset]
 */
const getAllProjects = async ({ page = 1, pageSize = 20, sort = '', offset = 0 }) => {
  const [rows, count] = await ClinicalGDCRawService.get({
    selection: ['proj__name', PROJECT_IDENTIFIER],
    distinct: true,
    page,
    pageSize,
    orderBy: buildOrderBy(sort),
    offset,
  });

  return [rows, count];
};

/**
 * Get Project data by an ID
 * @param {string} id
 */
const getProjectById = async (id) => {
  const [rows] = await ClinicalGDCRawService.get({ where: { [PROJECT_IDENTIFIER]: id } });

  if (rows && rows.length) {
    return rows[0];
  }

  return null;
};

/**
 * getAll Patient data by page and pageSize
 * @param {number=} [page]
 * @param {number=} [pageSize]
 * @param {string=} [sort]
 * @param {number=} [offset]
 */
const getAllPatients = async ({ page = 1, pageSize = 20, sort = '', offset = 0 }) => {
  const [rows, count] = await PatientService.get({
    page,
    pageSize,
    orderBy: buildOrderBy(sort),
    offset,
  });

  return [rows, count];
};

/**
 * Get Project data by an ID
 * @param {string} id
 */
const getPatientById = async (id) => {
  const [rows] = await ClinicalGDCRawService.get({ where: { [PATIENT_IDENTIFIER]: id } });

  return rows && rows.length ? rows[0] : null;
};

module.exports = {
  getAllGdc,
  getGdcById,
  getAllDiagnosis,
  getDiagnosisById,
  getAllBiospecimen,
  getBiospecimenById,
  getAllProjects,
  getProjectById,
  getAllPatients,
  getPatientById,
};
