const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');

const createCache = require('./cache');

const { url } = require('../config');

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
 *
 * @param {string} resources
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
    const query = Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`);
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

const buildReference = (reference, type, display) => {
  return {
    reference: reference,
    type: type,
    display: display,
  };
};

const buildIdentifier = (system, value) => {
  return {
    system: system,
    value: value,
  };
};

module.exports = {
  TCGA_REGEX,
  TCGA_SOURCE,
  ANVIL_SOURCE,
  buildSearchBundle,
  buildLinkFromUrl,
  buildEntry,
  getLinks,
  createCache,
  buildReference,
  buildIdentifier,
};
