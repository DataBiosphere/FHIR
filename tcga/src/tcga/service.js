const { BigQuery } = require('../services');

const ClinicalDiagnosisTreatments = new BigQuery(
  'isb-cgc-bq.TCGA.clinical_diagnoses_treatments_gdc_current'
);

class Service {
  getAll() {
    return ClinicalDiagnosisTreatments.get();
  }
}

module.exports = Service;
