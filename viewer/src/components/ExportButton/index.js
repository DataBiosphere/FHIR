import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { saveAs } from 'file-saver';

const useStyles = makeStyles(() => ({
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function ExportButton({ resourceType, bundle, fileType }) {
  const classes = useStyles();

  const onClick = () => {
    console.log(resourceType);

    const entries = [];

    bundle.entry.forEach((entry) => {
      entries.push(JSON.stringify(entry));
    });

    const blob = new Blob([entries.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'results.json');
  };

  return (
    <div className={classes.button}>
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={onClick}>
        Export Page
      </Button>
    </div>
  );
}

ExportButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  bundle: PropTypes.shape({
    entry: PropTypes.array.isRequired,
    total: PropTypes.number,
  }),
  fileType: PropTypes.string,
};

// default to print JSON
ExportButton.defaultProps = {
  bundle: undefined,
  fileType: '.json',
};

export default ExportButton;
