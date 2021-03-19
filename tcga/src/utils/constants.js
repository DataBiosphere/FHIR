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

module.exports = {
  GDC_TABLE,
  DIAGNOSIS_TABLE,
  BIOSPECIMEN_TABLE,
  DIAGNOSIS_IDENTIFIER,
  CASE_IDENTIFIER,
  BIOSPECIMEN_IDENTIFIER,
  PROJECT_IDENTIFIER,
  PATIENT_IDENTIFIER
}
