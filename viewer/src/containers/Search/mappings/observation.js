import React from 'react';
import { TableCell, Typography, Chip } from '@material-ui/core';

export const columns = ['ID', 'Code'];
export const renderers = [
  'id',
  [
    'code',
    (code) => {
      const { coding, text } = code;
      return (
        <TableCell>
          {coding ? (
            coding.map((codingElement) => (
              <>
                <Typography key={codingElement.code}>{codingElement.display}</Typography>
                <Chip label={`${codingElement.system}`} />
                <Chip label={`${codingElement.code}`} />
              </>
            ))
          ) : (
            <Typography>{text}</Typography>
          )}
        </TableCell>
      );
    },
  ],
];
