const { diseaseDisplayMapping, diseaseSystemMapping } = require('./mappings');

const DATA_SOURCE = 'https://anvil.terra.bio/';

const buildEntry = (resource, searchMode = 'match', queryParams = {}) => {
  let extension = '';
  if (queryParams && Object.keys(queryParams).length !== 0) {
    const query = Object.keys(queryParams).map(
      (key) => `${key}=${encodeURIComponent(queryParams[key])}`
    );
    extension = '?' + query.join('&');
  }

  return {
    resource,
    fullUrl: `${url}/${resource.resourceType}/${resource.id}${extension}`,
    search: {
      mode: searchMode,
    },
  };
};

const buildIdentifier = (system, value, use = 'temp') => {
  return {
    use: use,
    system: system,
    value: value,
  };
};

const buildCodeableConcept = (codes, text = '') => {
  const codeableConcept = { coding: codes };
  if (text) {
    codeableConcept.text = text;
  }

  return codeableConcept;
};

/**
 * Build coding
 * @param {string} code - code for coding
 * @param {string} system - uri for code
 * @param {string} display - the text for the code within the system
 */
const buildCoding = (code, system = '', display = '') => {
  const coding = { code: code };

  if (system) {
    coding.system = system;
  }

  if (display) {
    coding.display = display;
  }

  return coding;
};

const buildReference = (reference, type, display) => {
  return {
    reference: reference,
    type: type,
    display: display,
  };
};

const findDiseaseCodes = (code) => {
  // edge case for no code
  if (!code || code.length <= 1) {
    return null;
  }

  return buildCoding(code, findDiseaseSystem(code), findDiseaseDisplay(code));
};

const findDiseaseSystem = (code) => {
  const system = diseaseSystemMapping.find(({ regex }) => regex.test(code));
  return system ? system.system : null;
};

const findDiseaseDisplay = (code) => {
  const display = diseaseDisplayMapping[code];
  return display ? display : null;
};

// regex: [A-Za-z0-9\-\.]{1,64}
const buildSlug = (...args) => {
  let slug = [];
  // filter all bad matches
  args.forEach((arg) => {
    arg = arg ? arg.match(/[A-Za-z0-9\-\.]/g) : null;

    // edge case for null and '-' diseaseId's
    if (arg && arg.length >= 1) {
      slug.push(arg.join(''));
    }
  });

  if (slug.length < 1) {
    throw 'Invalid slug arguments';
  }
  return slug.join('-').substring(0, 64);
};

/**
 *
 * @param list {Array} - List of objects to dedupe
 * @returns {Array}
 */
function dedupeObjects(list) {
  const compareObjects = (a, b) => {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return true;
    }

    /* eslint-disable no-restricted-syntax */
    for (const key in a) {
      if (a[key] !== b[key]) return true;
    }
    return false;
  };

  return list.filter((search, index) => {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < index; i++) {
      if (!compareObjects(search, list[i])) return false;
    }
    return true;
  });
}

const buildSortObject = (sort) => {
  // edge case
  if (!sort) {
    return [{}, {}];
  }

  let sortObj = {};
  let existsObj = {};

  sort
    .split(',')
    .filter((str) => str)
    .forEach((str) => {
      str = str.trim();

      const field = str[0] === '-' ? str.substring(1) : str;
      sortObj[field] = str[0] === '-' ? -1 : 1;

      existsObj[field] = buildExistsProp();
    });

  return [sortObj, existsObj];
};

const translateSortObj = (sortFields, translateFn) => {
  const [sortObj, existsObj] = buildSortObject(sortFields);

    let keys = Object.keys(sortObj);
    keys.forEach((key) => {
      translateFn(sortObj, existsObj, key);
    });

    return [sortObj, existsObj];
}

const buildExistsProp = () => {
  return {
    $exists: true,
  };
};

module.exports = {
  buildEntry,
  buildCodeableConcept,
  buildIdentifier,
  buildCoding,
  buildReference,
  buildSlug,
  findDiseaseCodes,
  findDiseaseSystem,
  findDiseaseDisplay,
  dedupeObjects,
  buildSortObject,
  DATA_SOURCE,
  translateSortObj,
};
