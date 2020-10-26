const { BigQuery } = require('../services');

const ClinicalGDCService = new BigQuery('isb-cgc-bq.TCGA.clinical_gdc_current');

const ClinicalDiagnosisTreatments = new BigQuery(
  'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current'
);

const getAll = async ({ page, pageSize } = {}) => {
  return ClinicalGDCService.get({ page, pageSize });
};

const getById = async (id) => {
  const rows = await ClinicalGDCService.get({ where: { case_id: id } });
  if (rows && rows.length) {
    return rows[0];
  }
  return null;
};

module.exports = {
  getAll,
  getById,
};
