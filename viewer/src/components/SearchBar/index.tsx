import React, { useState, useEffect } from 'react';
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
  const PLEASE_SELECT_FILTER_MESSAGE = 'Please select a filter';
  const EMPTY_ERROR_MESSAGE = 'Please enter a valid filter';

  // state hooks
  const [resource, setResource] = useState<any>();
  const [menuItems, setMenuItems] = useState<any>();
  const [menuHint, setMenuHint] = useState<any>(PLEASE_SELECT_FILTER_MESSAGE);
  const [paramType, setParamType] = useState<any>();
  const [paramKey, setParamKey] = useState<any>('');
  const [paramValue, setParamValue] = useState<any>('');
  const [children, setChildren] = useState<Node[]>();

  const classes = useStyles();

  const onAddFilter = () => {
    if (paramKey && paramValue) {
      // adds filters based on paramType
      switch (paramType) {
        // parses for :contains and :exact
        case 'string':
          const regex = /"\s*(.*?)\s*"/;
          const match = paramValue.match(regex);

          let newParamValue = '';
          if (match) {
            newParamValue = `:exact=${match[1]}`;
          } else {
            newParamValue = `:contains=${paramValue}`;
          }

          addParams(paramKey, newParamValue);
          break;
        case 'uri':
          addParams(paramKey, `=${encodeURIComponent(paramValue)}`);
          break;
        default:
          addParams(paramKey, `=${paramValue}`);
          break;
      }
    } else {
      alert(EMPTY_ERROR_MESSAGE);
    }
  };

  // clears param field
  const clearParamField = () => {
    setParamValue('');
  };

  // parses meta and gets searchable parameters
  const getSearchParams = (resource?: string) => {
    const allParams = meta?.searchParam;
    const resourceParams = meta?.resource?.find((entry) => {
      return entry.type === resource;
    })?.searchParam;
    const params: any[] = [];

    // create menu item params with documentation
    allParams?.forEach((param) => {
      if (param.documentation) {
        params.push({ paramName: param.name, paramDoc: param.documentation });
      }
    });
    resourceParams?.forEach((param) => {
      params.push({ paramName: param.name, paramType: param.type, paramDoc: param.documentation });
    });

    // create child MenuItem entries
    const children: any[] = [];
    params.map((entry: any) => {
      children.push(
        <MenuItem key={entry.paramName} value={entry.paramName}>
          {entry.paramName}
        </MenuItem>
      );
    });

    // set menu items
    setMenuItems(params);
    setChildren(children);

    return params;
  };

  // sets the param hint
  const setParamHint = (param: string) => {
    menuItems
      .filter((entry: any) => entry.paramName == param)
      .map((entry: any) => {
        setMenuHint(entry.paramDoc);
        setParamType(encodeURIComponent(entry.paramType));
      });
  };

  // run on initial launch to get search params
  useEffect(() => {
    getSearchParams(DEFAULT_RESOURCE);
  }, [meta]);

  // gets search param after resource is changed
  useEffect(() => {
    updateResource(resource);
    getSearchParams(resource);

    resetParams();
    clearParamField();

    setParamKey('');
    setMenuHint(PLEASE_SELECT_FILTER_MESSAGE);
  }, [resource]);

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box flexGrow={0}>
          <FormControl className={classes.formControl}>
            <InputLabel>Resource</InputLabel>
            <Select
              id="resource"
              value={resource}
              defaultValue={DEFAULT_RESOURCE}
              onChange={(event) => {
                setResource(event.target.value);
              }}
            >
              <MenuItem value="" disabled>
                Select one...
              </MenuItem>
              <MenuItem value="DiagnosticReport">DiagnosticReport</MenuItem>
              <MenuItem value="Observation">Observation</MenuItem>
              <MenuItem value="Specimen">Specimen</MenuItem>
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="ResearchStudy">ResearchStudy</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel>Filter</InputLabel>
            <Select
              id="paramKey"
              value={paramKey}
              defaultValue=""
              onChange={(event) => {
                setParamKey(event.target.value);
                setParamHint(event.target.value as string);
                clearParamField();
              }}
              children={children}
            ></Select>
          </FormControl>
        </Box>

        <Box className={classes.formControl} flexGrow={1} alignContent="center">
          <TextField
            id="paramValue"
            value={paramValue}
            className={classes.flexCenter}
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
            onClick={onAddFilter}
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
