const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');

const { url } = require('../config');

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
  resources,
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
    entry: resources.map((resource) => {
      return {
        resource,
        fullUrl: `${url}/${resourceType}/${resource.id}`,
      };
    }),
    total,
  });
};

module.exports = {
  buildSearchBundle,
  buildLinkFromUrl,
  getLinks,
};
