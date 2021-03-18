/*
 *
 * Search constants
 *
 */

// paginated table constants
export const DEFAULT_ROWS_PER_PAGE = 25;
export const PARSING_ROWS_PER_PAGE = 250;

// diagnostic report renderer constants
export const DIAGNOSTIC_REPORT_CASE_ID = 'id';
export const DIAGNOSTIC_REPORT_SUBJECT = 'subject.reference';
export const DIAGNOSTIC_REPORT_STUDY = 'extension[0].valueReference.reference';
export const DIAGNOSTIC_REPORT_RESULT = 'result';

// observation renderer constants
export const OBSERVATION_ID = 'id';
export const OBSERVATION_CODE = 'code';

// research study renderer constants
export const RESEARCH_STUDY_STUDY = 'id';
export const RESEARCH_STUDY_TITLE = 'title';
export const RESEARCH_STUDY_STATUS = 'status';

// specimen renderer constants
export const SPECIMEN_ID = 'id';
