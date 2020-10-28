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

const getAll = async ({ page, pageSize } = {}) => {
  return ClinicalGDCService.get({ page, pageSize });
};

const getById = async (id) => {
  const [rows] = await ClinicalGDCService.get({ where: { case_id: id } });
  if (rows && rows.length) {
    return rows[0];
  }
  return null;
};

module.exports = {
  getAll,
  getById,
};
