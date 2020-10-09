const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;

const fhirServerConfig = {
  server: {
    port: process.env.PORT || 3000,
  },
  logging: {
    level: process.env.LOGGING_LEVEL || 'info',
  },
  profiles: {
    molecularsequence: {
      service: './src/profiles/molecularsequence/index.js',
      versions: [VERSIONS['4_0_0']],
      baseUrls: ['/api'],
    },
  },
  url: process.env.URL,
  bundleSize: process.env.BUNDLE_SIZE || 20,
};

module.exports = fhirServerConfig;
