const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const path = require('path');

const fhirServerConfig = {
  server: {
    port: process.env.PORT || 3000,
  },
  logging: {
    level: process.env.LOGGING_LEVEL || 'info',
  },
  profiles: {
    molecularsequence: {
      service: path.resolve('./src/profiles/molecularsequence/index.js'),
      metadata: path.resolve('./src/profiles/molecularsequence/metadata'),
      versions: [VERSIONS['4_0_0']],
      baseUrls: ['/api'],
    },
  },
  url: process.env.URL,
  bundleSize: process.env.BUNDLE_SIZE || 20,
};

module.exports = fhirServerConfig;
