import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(() => ({
  divider: {
    width: 5,
  },
}));

function ExportButton({ onClick, downloadProgress }: any) {
  const classes = useStyles();
  const [downloading, setDownloading] = useState(false);

  const processClick = () => {
    onClick();
    setDownloading(true);
  };

  // allow the button to be pressed when download is done
  useEffect(() => {
    if (downloadProgress >= 1) {
      console.log('done');
      setDownloading(false);
    }
  }, [downloadProgress]);

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={processClick}
        disabled={downloading}
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
