import React from 'react';
import { TableCell, Typography, Chip } from '@material-ui/core';
import {
  OBSERVATION_ID,
  OBSERVATION_STUDY,
  OBSERVATION_CODE,
  OBSERVATION_REFERENCE,
} from '../constants';

export const columns = ['Observation ID', 'Study', 'Code', 'Subject'];
export const renderers = [
  OBSERVATION_ID,
  OBSERVATION_STUDY,
  [
    OBSERVATION_CODE,
    (code: fhir.CodeableConcept) => {
      const { coding, text } = code || { coding: '', text: '' };
      return (
        <TableCell>
          {coding ? (
            coding.map((codingElement: fhir.Coding) => (
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
  OBSERVATION_REFERENCE,
];
