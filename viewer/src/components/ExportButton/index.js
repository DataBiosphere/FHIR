import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(() => ({
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function ExportButton({ resourceType, fileType }) {
  const classes = useStyles();

  return (
    <div className={classes.button}>
      <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
        Export Results
      </Button>
    </div>
  );
}

ExportButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  fileType: PropTypes.string,
};

// default to print JSON
ExportButton.defaultProps = {
  fileType: '.json',
};

export default ExportButton;
