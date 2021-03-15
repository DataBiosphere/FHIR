import React, { useEffect, useState, useRef } from 'react';
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
  getResources: (
    resourceType: any,
    page: number,
    count: number,
    pageLinks: string[],
    params: any
  ) => void;
  addParams: (key: string, value: string) => void;
  resetParams: () => void;
  pageLinks: string[];
  params: any;
  rowsPerPage: number;
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

function SearchBar({
  getResources,
  addParams,
  resetParams,
  pageLinks,
  params,
  rowsPerPage,
}: SearchBarType) {
  // hooks
  const [paramKey, setParamKey] = useState<any>('_id');
  const [paramValue, setParamValue] = useState<any>('');
  const [resource, setResource] = useState<any>('');

  const paramRef = useRef<any>(null);

  const classes = useStyles();

  const clearParamField = () => {
    paramRef.current.value = '';
  };

  const onAddClicked = () => {
    addParams(paramKey, paramValue);
  };

  const onResetClicked = () => {
    clearParamField();
    resetParams();
  };

  const onApplyClicked = () => {
    getResources(resource, 1, rowsPerPage, pageLinks, params);
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
                setResource(event.target.value);
                resetParams();
                clearParamField();
                getResources(event.target.value, 1, rowsPerPage, [], {});
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
            onClick={onAddClicked}
          >
            Add Filter
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<RotateLeftIcon />}
            onClick={onResetClicked}
          >
            Reset Filters
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onApplyClicked}
          >
            Apply Filter
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default SearchBar;
