import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';

interface ExportButtonType {
  onClick: any;
  downloadProgress: number;
}

const useStyles = makeStyles(() => ({
  divider: {
    width: 5,
  },
}));

function ExportButton({ onClick, downloadProgress }: ExportButtonType) {
  const classes = useStyles();
  const [downloading, setDownloading] = useState(false);

  const processClick = () => {
    onClick();
    setDownloading(true);
  };

  // allow the button to be pressed when download is done
  useEffect(() => {
    if (downloadProgress >= 1) {
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

export default ExportButton;
