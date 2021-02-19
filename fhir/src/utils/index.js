const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');

const createCache = require('./cache');

const { url } = require('../config');

const { diseaseDisplayMapping, diseaseSystemMapping } = require('./anvilmappings');

const TCGA_REGEX = /TCGA-/;
const TCGA_SOURCE = 'https://portal.gdc.cancer.gov/';
const ANVIL_SOURCE = 'https://anvil.terra.bio/';

const addTrailingSlash = (baseUrl) => {
  if (baseUrl[baseUrl.length - 1] !== '/') {
    return `${baseUrl}/`;
  }
  return baseUrl;
};

/**
 *
 * @param {string} relation
 * @param {URL} linkUrl
 */
const buildLinkFromUrl = (relation, linkUrl) => {
  return {
    relation,
    url: linkUrl.toString(),
  };
};

/**
 *
 * @param {string} baseUrl
 * @param {string} resourceType
 * @param {string} page
 * @param {string} pageSize
 */
const getLinks = ({ baseUrl, resourceType, page, pageSize, fhirVersion }) => {
  const urlAndVersion = addTrailingSlash(baseUrl) + fhirVersion;
  const links = [];

  const linkSelf = new URL(resourceType, urlAndVersion);

  linkSelf.searchParams.set('_page', Number(page));
  linkSelf.searchParams.set('_count', pageSize);

  const linkNext = new URL(resourceType, urlAndVersion);
  linkNext.searchParams.set('_page', Number(page) + 1);
  linkNext.searchParams.set('_count', pageSize);

  const urlNext = buildLinkFromUrl('next', linkNext);
  const urlSelf = buildLinkFromUrl('self', linkSelf);

  if (page > 1) {
    const linkPrevious = new URL(resourceType, urlAndVersion);
    linkNext.searchParams.set('_page', Number(page) - 1);
    linkNext.searchParams.set('_count', pageSize);
    links.push(buildLinkFromUrl('previous', linkPrevious));
  }

  links.push(urlSelf, urlNext);

  return links;
};

/**
 * Build search bundle
 * @param {string[]} entries - list of already built resources
 * @param {string} fhirVersion
 */
const buildSearchBundle = ({
  resourceType,
  entries,
  total,
  page,
  pageSize,
  fhirVersion = VERSIONS['4_0_0'],
}) => {
  const Bundle = resolveSchema(fhirVersion, 'Bundle');
  return new Bundle({
    type: 'searchset',
    timestamp: new Date(),
    link: getLinks({ baseUrl: url, resourceType, page, pageSize, fhirVersion }),
    entry: entries,
    total,
  });
};

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

// TODO: write unit tests
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

    if (arg && arg.length >= 1) {
      slug.push(arg.join(''));
    }
  });

  if (slug.length < 1) {
    throw 'Invalid slug arguments';
  }
  return slug.join('-').substring(0, 64);
};

module.exports = {
  TCGA_REGEX,
  TCGA_SOURCE,
  ANVIL_SOURCE,
  createCache,
  getLinks,
  buildLinkFromUrl,
  buildSearchBundle,
  buildEntry,
  buildIdentifier,
  buildCodeableConcept,
  buildCoding,
  buildReference,
  findDiseaseCodes,
  findDiseaseSystem,
  findDiseaseDisplay,
  buildSlug,
};
