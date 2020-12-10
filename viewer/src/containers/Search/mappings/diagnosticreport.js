import React from 'react';
import { TableCell, Chip } from '@material-ui/core';

export const columns = ['Case ID', 'Subject', 'Study', 'Results'];
export const renderers = [
  'id',
  'subject.reference',
  'extension[0].valueReference.reference',
  [
    'result',
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
