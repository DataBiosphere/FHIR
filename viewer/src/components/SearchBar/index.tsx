import React, { useState, useRef, useEffect } from 'react';
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
  meta: fhir.CapabilityStatementRest;
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

function SearchBar({ updateResource, addParams, resetParams, applyParams, meta }: SearchBarType) {
  const DEFAULT_RESOURCE = 'DiagnosticReport';

  // state hooks
  const [menuItems, setMenuItems] = useState<any>();
  const [menuHint, setMenuHint] = useState<any>('Filter value');
  const [paramKey, setParamKey] = useState<any>('ID');
  const [paramValue, setParamValue] = useState<any>('');

  // ref hooks
  const resRef = useRef<any>(null);
  const paramRef = useRef<any>(null);

  const classes = useStyles();

  // clears param field
  const clearParamField = () => {
    paramRef.current.value = '';
  };

  // parses meta and gets searchable parameters
  const getSearchParams = (resource?: string) => {
    const allParams = meta?.searchParam;
    const resourceParams = meta?.resource?.find((entry) => {
      return entry.type === resource;
    })?.searchParam;
    const params: any[] = [];

    allParams?.forEach((param) => {
      if (param.documentation) {
        params.push({ paramName: param.name, paramDoc: param.documentation });
      }
    });
    resourceParams?.forEach((param) => {
      params.push({ paramName: param.name, paramDoc: param.documentation });
    });

    setMenuItems(params);
    return params;
  };

  const getParamHint = (param: string) => {
    menuItems
      .filter((entry: any) => entry.paramName == param)
      .map((entry: any) => {
        setMenuHint(entry.paramDoc);
      });
  };

  // run on initial launch to change parameter
  useEffect(() => {
    getSearchParams(DEFAULT_RESOURCE);
  }, [meta]);

  // runs when resource is changed
  useEffect(() => {
    getSearchParams(resRef.current.innerText);
  }, [resRef.current?.innerText]);

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box flexGrow={0}>
          <FormControl className={classes.formControl}>
            <InputLabel>Resource</InputLabel>
            <Select
              ref={resRef}
              defaultValue={DEFAULT_RESOURCE}
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
              <MenuItem value="Patient">Patient</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel>Filter</InputLabel>
            <Select
              id="paramKey"
              defaultValue=""
              onChange={(event) => {
                clearParamField();
                setParamKey(event.target.value);
                getParamHint(event.target.value as string);
              }}
            >
              {menuItems
                ? menuItems.map((entry: any) => {
                    return (
                      <MenuItem key={entry.paramName} value={entry.paramName}>
                        {entry.paramName}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </FormControl>
        </Box>

        <Box className={classes.formControl} flexGrow={1} alignContent="center">
          <TextField
            className={classes.flexCenter}
            inputRef={paramRef} // inputRef != ref...
            label={menuHint}
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

export default SearchBar;
