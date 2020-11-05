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
    DiagnosticReport: {
      service: path.resolve('./src/profiles/diagnosticreport/index'),
      metadata: path.resolve('./src/profiles/diagnosticreport/metadata'),
      versions: [VERSIONS['4_0_0']],
    },
    Observation: {
      service: path.resolve('./src/profiles/observation/index'),
      metadata: path.resolve('./src/profiles/observation/metadata'),
      versions: [VERSIONS['4_0_0']],
    },
  },
  url: process.env.URL,
  bundleSize: process.env.BUNDLE_SIZE || 20,
};

module.exports = fhirServerConfig;
