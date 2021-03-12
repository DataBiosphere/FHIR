import React from 'react';
import {
  makeStyles,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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

  // const processClick = () => {};

  return (
    <>
      {Object.entries(params).map(([k, v]) => (
        <Chip
          key={k}
          className={classes.chip}
          label={`${k}: ${v}`}
          onDelete={() => onDelete(k)}
        ></Chip>
      ))}
    </>
  );
}
{
  /* <IconButton edge="end" aria-label="delete" onClick={(_) => onDelete(k)}> */
}

export default FilterList;
