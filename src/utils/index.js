const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');

/**
 *
 * @param {string} resources
 * @param {string} fhirVersion
 */
const buildSearchBundle = (resources, fhirVersion = VERSIONS['4_0_0']) => {
  const Bundle = resolveSchema(fhirVersion, 'Bundle');
  return new Bundle({
    type: 'searchset',
    timestamp: new Date(),
    total: resources.length,
    entry: resources.map((resource) => {
      return {
        resource,
      };
    }),
  });
};

module.exports = {
  buildSearchBundle,
};
