const { BigQuery } = require('../services');

const ClinicalDiagnosisTreatments = new BigQuery(
  'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current'
);

const getAll = async ({ page, pageSize }) => {
  return ClinicalDiagnosisTreatments.get({ page, pageSize });
};

module.exports = {
  getAll,
};
