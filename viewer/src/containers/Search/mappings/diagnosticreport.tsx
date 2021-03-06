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
    (results: any) => {
      return results ? (
        results.map((result: any) => (
          <TableCell
            key={`${result.display}${result.reference}`}
            style={{ display: 'flex', flexDirection: 'column', padding: '.25rem' }}
          >
            {result.display ? (
              <>
                <span>{result.display}</span>
                <Chip label={result.reference} />{' '}
              </>
            ) : (
              <>
                <span>No Mapping</span>
                <Chip label={result.reference} />
              </>
            )}
          </TableCell>
        ))
      ) : (
        <TableCell style={{ display: 'flex', flexDirection: 'column', padding: '.25rem' }} />
      );
    },
  ],
];
