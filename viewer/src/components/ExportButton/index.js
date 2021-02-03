import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(() => ({
  divider: {
    width: 5,
  },
}));

function ExportButton({ onClick, downloadProgress }) {
  const classes = useStyles();
  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onClick}
        disabled={downloadProgress !== 0 || downloadProgress >= 1}
      >
        Export Page
        <div className={classes.divider} />
        <CircularProgress
          color="inherit"
          variant="determinate"
          size={20}
          value={downloadProgress * 100}
        />
      </Button>
    </div>
  );
}

ExportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  downloadProgress: PropTypes.number.isRequired,
};

export default ExportButton;
