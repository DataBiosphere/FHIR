import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SearchIcon from '@material-ui/icons/Search';

interface SearchBarType {
  updateResource: any;
  addParams: (key: string, value: string) => void;
  resetParams: () => void;
  applyParams: () => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
  button: {
    margin: theme.spacing(0.25),
    marginTop: 20,
  },
}));

function SearchBar({ updateResource, addParams, resetParams, applyParams }: SearchBarType) {
  // hooks
  const [paramKey, setParamKey] = useState<any>('_id');
  const [paramValue, setParamValue] = useState<any>('');

  const paramRef = useRef<any>(null);

  const classes = useStyles();

  const clearParamField = () => {
    paramRef.current.value = '';
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box flexGrow={0}>
          <FormControl className={classes.formControl}>
            <InputLabel>Resource</InputLabel>
            <Select
              defaultValue="DiagnosticReport"
              onChange={(event) => {
                resetParams();
                clearParamField();
                updateResource(event.target.value);
              }}
            >
              <MenuItem value="DiagnosticReport">DiagnosticReport</MenuItem>
              <MenuItem value="Observation">Observation</MenuItem>
              <MenuItem value="Specimen">Specimen</MenuItem>
              <MenuItem value="ResearchStudy">ResearchStudy</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel>Parameter</InputLabel>
            <Select
              id="paramKey"
              defaultValue="_id"
              onChange={(event) => {
                clearParamField();
                setParamKey(event.target.value);
              }}
            >
              <MenuItem value="_id">ID</MenuItem>
              <MenuItem value="_source">Source</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box></Box>

        <Box className={classes.formControl} flexGrow={1} alignContent="center">
          <TextField
            className={classes.flexCenter}
            inputRef={paramRef} // inputRef != ref...
            label="Search Value"
            onChange={(event) => {
              setParamValue(event.target.value);
            }}
          />
        </Box>

        <Box className={classes.formControl} flexGrow={0}>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              addParams(paramKey, paramValue);
            }}
          >
            Add Filter
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<RotateLeftIcon />}
            onClick={() => {
              clearParamField();
              resetParams();
            }}
          >
            Reset Filters
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={applyParams}
          >
            Apply Filter
          </Button>
        </Box>
      </Box>
    </>
  );
}

SearchBar.defaultProps = {
  selectedResource: 'DiagnosticReport',
};

export default SearchBar;
