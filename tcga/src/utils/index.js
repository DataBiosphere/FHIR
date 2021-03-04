/**
 * Transform a row from the TCGA query into sub objects of their original tables
 *
 * @param {row} row
 */
const transformGdcResults = (row) => ({
  case_id: row.case_id,
  current: {
    submitter_id: row.submitter_id,
    case_id: row.case_id,
    diag__treat__count: row.diag__treat__count,
    primary_site: row.primary_site,
    disease_type: row.disease_type,
    proj__name: row.proj__name,
    proj__project_id: row.proj__project_id,
    demo__demographic_id: row.demo__demographic_id,
    demo__gender: row.demo__gender,
    demo__race: row.demo__race,
    demo__ethnicity: row.demo__ethnicity,
    demo__vital_status: row.demo__vital_status,
    demo__days_to_birth: row.demo__days_to_birth,
    demo__year_of_birth: row.demo__year_of_birth,
    demo__age_at_index: row.demo__age_at_index,
    demo__year_of_death: row.demo__year_of_death,
    demo__days_to_death: row.demo__days_to_death,
    demo__state: row.demo__state,
    demo__created_datetime: row.demo__created_datetime,
    demo__updated_datetime: row.demo__updated_datetime,
    diag__diagnosis_id: row.diag__diagnosis_id,
    diag__ajcc_clinical_n: row.diag__ajcc_clinical_n,
    diag__masaoka_stage: row.diag__masaoka_stage,
    diag__ajcc_clinical_m: row.diag__ajcc_clinical_m,
    diag__primary_diagnosis: row.diag__primary_diagnosis,
    diag__primary_gleason_grade: row.diag__primary_gleason_grade,
    diag__year_of_diagnosis: row.diag__year_of_diagnosis,
    diag__figo_stage: row.diag__figo_stage,
    diag__progression_or_recurrence: row.diag__progression_or_recurrence,
    diag__ajcc_pathologic_m: row.diag__ajcc_pathologic_m,
    diag__site_of_resection_or_biopsy: row.diag__site_of_resection_or_biopsy,
    diag__ajcc_staging_system_edition: row.diag__ajcc_staging_system_edition,
    diag__icd_10_code: row.diag__icd_10_code,
    diag__age_at_diagnosis: row.diag__age_at_diagnosis,
    diag__ajcc_clinical_t: row.diag__ajcc_clinical_t,
    diag__days_to_last_follow_up: row.diag__days_to_last_follow_up,
    diag__ajcc_pathologic_stage: row.diag__ajcc_pathologic_stage,
    diag__tumor_grade: row.diag__tumor_grade,
    diag__last_known_disease_status: row.diag__last_known_disease_status,
    diag__ann_arbor_extranodal_involvement: row.diag__ann_arbor_extranodal_involvement,
    diag__ajcc_clinical_stage: row.diag__ajcc_clinical_stage,
    diag__secondary_gleason_grade: row.diag__secondary_gleason_grade,
    diag__synchronous_malignancy: row.diag__synchronous_malignancy,
    diag__morphology: row.diag__morphology,
    diag__ajcc_pathologic_t: row.diag__ajcc_pathologic_t,
    diag__igcccg_stage: row.diag__igcccg_stage,
    diag__classification_of_tumor: row.diag__classification_of_tumor,
    diag__ann_arbor_clinical_stage: row.diag__ann_arbor_clinical_stage,
    diag__ann_arbor_b_symptoms: row.diag__ann_arbor_b_symptoms,
    diag__tumor_stage: row.diag__tumor_stage,
    diag__prior_treatment: row.diag__prior_treatment,
    diag__ajcc_pathologic_n: row.diag__ajcc_pathologic_n,
    diag__tissue_or_organ_of_origin: row.diag__tissue_or_organ_of_origin,
    diag__prior_malignancy: row.diag__prior_malignancy,
    diag__state: row.diag__state,
    diag__created_datetime: row.diag__created_datetime,
    diag__updated_datetime: row.diag__updated_datetime,
    exp__exposure_id: row.exp__exposure_id,
    exp__height: row.exp__height,
    exp__weight: row.exp__weight,
    exp__bmi: row.exp__bmi,
    exp__years_smoked: row.exp__years_smoked,
    exp__pack_years_smoked: row.exp__pack_years_smoked,
    exp__cigarettes_per_day: row.exp__cigarettes_per_day,
    exp__alcohol_history: row.exp__alcohol_history,
    exp__state: row.exp__state,
    exp__created_datetime: row.exp__created_datetime,
    exp__updated_datetime: row.exp__updated_datetime,
    state: row.state,
    updated_datetime: row.updated_datetime,
  },
  diagnoses: [
    {
      diag__diagnosis_id: row.diag__diagnosis_id,
      diag__treat__treatment_id: row.diag__treat__treatment_id,
      case_id: row.case_id,
      diag__treat__treatment_type: row.diag__treat__treatment_type,
      diag__treat__treatment_or_therapy: row.diag__treat__treatment_or_therapy,
      diag__treat__state: row.diag__treat__state,
      diag__treat__created_datetime: row.diag__treat__created_datetime,
      diag__treat__updated_datetime: row.diag__treat__updated_datetime,
    },
  ],
  biospecimen: [
    {
      sample_barcode: row.sample_barcode,
      sample_gdc_id: row.sample_gdc_id,
      case_barcode: row.case_barcode,
      case_gdc_id: row.case_gdc_id,
      sample_type: row.sample_type,
      sample_type_name: row.sample_type_name,
      program_name: row.program_name,
      project_short_name: row.project_short_name,
      batch_number: row.batch_number,
      bcr: row.bcr,
      days_to_collection: row.days_to_collection,
      days_to_sample_procurement: row.days_to_sample_procurement,
      is_ffpe: row.is_ffpe,
      num_portions: row.num_portions,
      num_slides: row.num_slides,
      avg_percent_lymphocyte_infiltration: row.avg_percent_lymphocyte_infiltration,
      avg_percent_monocyte_infiltration: row.avg_percent_monocyte_infiltration,
      avg_percent_necrosis: row.avg_percent_necrosis,
      avg_percent_neutrophil_infiltration: row.avg_percent_neutrophil_infiltration,
      avg_percent_normal_cells: row.avg_percent_normal_cells,
      avg_percent_tumor_nuclei: row.avg_percent_tumor_nuclei,
      max_percent_lymphocyte_infiltration: row.max_percent_lymphocyte_infiltration,
      max_percent_monocyte_infiltration: row.max_percent_monocyte_infiltration,
      max_percent_necrosis: row.max_percent_monocyte_infiltration,
      max_percent_neutrophil_infiltration: row.max_percent_neutrophil_infiltration,
      max_percent_normal_cells: row.max_percent_normal_cells,
      max_percent_stromal_cells: row.max_percent_stromal_cells,
      max_percent_tumor_cells: row.max_percent_tumor_cells,
      max_percent_tumor_nuclei: row.max_percent_tumor_nuclei,
      min_percent_lymphocyte_infiltration: row.min_percent_lymphocyte_infiltration,
      min_percent_monocyte_infiltration: row.min_percent_monocyte_infiltration,
      min_percent_necrosis: row.min_percent_necrosis,
      min_percent_neutrophil_infiltration: row.min_percent_neutrophil_infiltration,
      min_percent_normal_cells: row.min_percent_normal_cells,
      min_percent_stromal_cells: row.min_percent_stromal_cells,
      min_percent_tumor_cells: row.min_percent_tumor_cells,
      min_percent_tumor_nuclei: row.min_percent_tumor_nuclei,
    },
  ],
});

/**
 * Removes duplicate objects in list
 * @param {Array} list - list of objects to dedupe
 * @returns {Array} list of unique objects
 */
function dedupeObjects(list) {
  const compareObjects = (a, b) => {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return true;
    }

    /* eslint-disable no-restricted-syntax */
    for (const key in a) {
      if (a[key] !== b[key]) return true;
    }
    return false;
  };

  return list.filter((search, index) => {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < index; i++) {
      if (!compareObjects(search, list[i])) return false;
    }
    return true;
  });
}

/**
 * Creates string for BigQuery to sort by
 * @param {string} sort - decides to sort by name or number
 * @returns {string}
 */
function buildOrderBy(sort) {
  return sort
    ? sort
        .split(',')
        .filter((str) => str)
        .map((str) => {
          str = str.trim();

          return {
            column: str[0] === '-' ? str.substring(1) : str,
            order: str[0] === '-' ? 'desc' : 'asc',
          };
        })
    : null;
}

module.exports = {
  transformGdcResults,
  dedupeObjects,
  buildOrderBy,
};
