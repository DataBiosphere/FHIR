const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');

const { url } = require('../config');

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
const getLinks = ({ baseUrl, resourceType, page, pageSize }) => {
  const links = [];

  const linkSelf = new URL(resourceType, baseUrl);
  console.log(linkSelf);
  linkSelf.searchParams.set('_page', Number(page));
  linkSelf.searchParams.set('_count', pageSize);

  const linkNext = new URL(resourceType, baseUrl);
  linkNext.searchParams.set('_page', Number(page) + 1);
  linkNext.searchParams.set('_count', pageSize);

  const urlNext = buildLinkFromUrl('next', linkNext);
  const urlSelf = buildLinkFromUrl('self', linkSelf);

  if (page > 1) {
    const linkPrevious = new URL(resourcePath, baseUrl);
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
  page,
  pageSize,
  fhirVersion = VERSIONS['4_0_0'],
}) => {
  const Bundle = resolveSchema(fhirVersion, 'Bundle');
  return new Bundle({
    type: 'searchset',
    timestamp: new Date(),
    total: resources.length,
    link: getLinks({ baseUrl: url, resourceType, page, pageSize }),
    entry: resources.map((resource) => {
      return {
        resource,
      };
    }),
  });
};

module.exports = {
  buildSearchBundle,
  buildLinkFromUrl,
  getLinks,
};
