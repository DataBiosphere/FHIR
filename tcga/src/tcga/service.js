const { dedupeObjects, transformTCGAResults } = require('../utils');
const { BigQuery } = require('../services');

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
});

/**
 * Convert a BigQuery results set to an organized model by caseID -> diagnoses|biospecimens
 *
 * @param {array} rows
 */
const transformRows = (rows) => {
  const caseIdMappings = rows.map(transformTCGAResults).reduce((accum, ele) => {
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
const getAllGdc = async ({ page, pageSize } = {}) => {
  const [rows, count] = await ClinicalGDCService.get({ page, pageSize });

  return [transformRows(rows), count];
};

/**
 * Get GDC data by an ID
 * @param {string} id
 */
const getByGdcById = async (id) => {
  const [rows] = await ClinicalGDCService.get({ where: { case_id: id } });

  if (rows && rows.length) {
    return transformRows(rows)[0];
  }
  return null;
};

/**
 * getAll Diagnosis data by page and pageSize
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllDiagnosis = async ({ page, pageSize } = {}) => {
  const [rows, count] = await DiagnosisService.get({ page, pageSize });

  return [rows, count];
};

/**
 * Get Diagnosis data by an ID
 * @param {string} id
 */
const getByDiagnosisById = async (id) => {
  const [rows] = await DiagnosisService.get({ where: { diag__diagnosis_id: id } });

  if (rows && rows.length) {
    return rows[0];
  }
  return null;
};

module.exports = {
  getAllGdc,
  getByGdcById,
  getAllDiagnosis,
  getByDiagnosisById,
};
