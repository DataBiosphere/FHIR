import React from 'react';
import {
  makeStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

interface FilterListType {
  params: any;
  onDelete: any;
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
}));

function FilterList({ params, onDelete }: FilterListType) {
  const classes = useStyles();

  // const processClick = () => {};

  return (
    <>
      <List className={classes.root}>
        {Object.entries(params).map(([k, v]) => (
          <ListItem key={k}>
            <ListItemText>
              {k}-{v}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <HighlightOffIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default FilterList;
