import React from 'react';
import { TableCell, Chip } from '@material-ui/core';
import {
  DIAGNOSTIC_REPORT_CASE_ID,
  DIAGNOSTIC_REPORT_RESULT,
  DIAGNOSTIC_REPORT_STUDY,
  DIAGNOSTIC_REPORT_SUBJECT,
} from '../constants';

export const columns = ['Case ID', 'Subject', 'Study', 'Results'];
export const renderers = [
  DIAGNOSTIC_REPORT_CASE_ID,
  DIAGNOSTIC_REPORT_SUBJECT,
  DIAGNOSTIC_REPORT_STUDY,
  [
    DIAGNOSTIC_REPORT_RESULT,
    // we map both the result's display and the reference to a TableCell
    (results) => {
      return results.map((result) => (
        <TableCell
          key={`${result.display}${result.reference}`}
          style={{ display: 'flex', flexDirection: 'column', padding: '.25rem' }}
        >
          <span>{result.display}</span>
          <Chip label={result.reference} />
        </TableCell>
      ));
    },
  ],
];
