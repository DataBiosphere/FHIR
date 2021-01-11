const { dedupeObjects, transformGdcResults } = require('../utils');
const { BigQuery } = require('../services');

const PROJECT_IDENTIFIER_COLUMN = 'proj__project_id';

const ClinicalGDCRawService = new BigQuery({
  table: 'isb-cgc-bq.TCGA.clinical_gdc_current',
  primaryKey: 'case_id',
});

const ClinicalGDCService = new BigQuery({
  table: 'isb-cgc-bq.TCGA.clinical_gdc_current',
  primaryKey: 'case_id',
  joins: [
    {
      table: 'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current',
      on: ['case_id', 'case_id'],
    },
    {
      table: 'isb-cgc-bq.TCGA.biospecimen_gdc_current',
      on: ['case_id', 'case_gdc_id'],
    },
  ],
});

const DiagnosisService = new BigQuery({
  table: 'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current',
  primaryKey: 'diag__diagnosis_id',
  joins: [
    {
      table: 'isb-cgc-bq.TCGA.clinical_gdc_current',
      on: ['case_id', 'case_id'],
    },
  ],
});

const BiospecimenService = new BigQuery({
  table: 'isb-cgc-bq.TCGA.biospecimen_gdc_current',
  primaryKey: 'sample_gdc_id',
  joins: [
    {
      table: 'isb-cgc-bq.TCGA.clinical_gdc_current',
      on: ['case_gdc_id', 'case_id'],
    },
  ],
});

/**
 * Convert a BigQuery results set to an organized model by caseID -> diagnoses|biospecimens
 *
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
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllGdc = async ({ page, pageSize } = { page: 1, pageSize: 20 }) => {
  const [caseIds] = await ClinicalGDCRawService.get({ selection: ['case_id'], page, pageSize });

  const [rows, count] = await ClinicalGDCService.get({
    whereIn: ['case_id', caseIds.map((row) => row.case_id)],
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
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllDiagnosis = async ({ page, pageSize } = { page: 1, pageSize: 20 }) => {
  const [rows, count] = await DiagnosisService.get({ page, pageSize });

  return [rows, count];
};

/**
 * Get Diagnosis data by an ID
 * @param {string} id
 */
const getDiagnosisById = async (id) => {
  const [rows] = await DiagnosisService.get({ where: { diag__diagnosis_id: id } });

  if (rows && rows.length) {
    return rows[0];
  }

  return null;
};

/**
 * getAll Biospecimen data by page and pageSize
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllBiospecimen = async ({ page, pageSize } = { page: 1, pageSize: 20 }) => {
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
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllProjects = async ({ page, pageSize } = { page: 1, pageSize: 20 }) => {
  const [rows, count] = await ClinicalGDCRawService.get({
    selection: ['proj__name', PROJECT_IDENTIFIER_COLUMN],
    page,
    pageSize,
    distinct: true,
  });

  return [rows, count];
};

/**
 * Get Project data by an ID
 * @param {string} id
 */
const getProjectById = async (id) => {
  const [rows] = await ClinicalGDCRawService.get({ where: { [PROJECT_IDENTIFIER_COLUMN]: id } });

  if (rows && rows.length) {
    return rows[0];
  }

  return null;
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
};
