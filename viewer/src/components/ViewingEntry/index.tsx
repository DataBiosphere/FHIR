import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';

interface ViewingEntryValue {
  title: string;
  entry: string;
  isOpen: boolean;
  handleClose: any;
}

const useStyles = makeStyles((theme) => ({
  viewingEntry: {
    color: theme.palette.text.primary,
  },
}));

function ViewingEntry({ title, entry, isOpen, handleClose }: ViewingEntryValue) {
  const classes = useStyles();

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="md">
        <DialogTitle>{`Viewing ${title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.viewingEntry}>
            <pre>
              <code>{entry}</code>
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewingEntry;
