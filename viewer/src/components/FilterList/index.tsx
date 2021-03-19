import React from 'react';
import { makeStyles, Chip } from '@material-ui/core';

interface FilterListType {
  params: any;
  onDelete: (key: string) => void;
}

const useStyles = makeStyles(() => ({
  chip: {
    minWidth: 150,
    marginLeft: 5,
    marginRight: 5,
  },
}));

function FilterList({ params, onDelete }: FilterListType) {
  const classes = useStyles();

  return (
    <>
      {Object.entries(params).map(([k, v]) => (
        <Chip
          key={k}
          className={classes.chip}
          label={`${k}${v}`}
          onDelete={() => onDelete(k)}
        ></Chip>
      ))}
    </>
  );
}

export default FilterList;
