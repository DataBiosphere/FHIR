const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const env = require('var');
const path = require('path');

// Set up whitelist
const whitelistEnv =
  (env.WHITELIST && env.WHITELIST.split(',').map((host) => host.trim())) || false;

// If there are multiple, keep them as an array
const whitelist = whitelistEnv && whitelistEnv.length === 1 ? whitelistEnv[0] : whitelistEnv;

const fhirServerConfig = {
  //   auth: {
  //     // This servers URI
  //     resourceServer: env.RESOURCE_SERVER,
  //     //
  //     // if you use this strategy, you need to add the corresponding env vars to docker-compose
  //     //
  //     // strategy: {
  //     //   name: 'bearer',
  //     //   useSession: false,
  //     //   service: './src/strategies/bearer.strategy.js'
  //     // },
  //   },
  server: {
    // support various ENV that uses PORT vs SERVER_PORT
    port: env.PORT || env.SERVER_PORT,
    // allow Access-Control-Allow-Origin
    corsOptions: {
      maxAge: 86400,
      origin: whitelist,
    },
  },
  logging: {
    level: env.LOGGING_LEVEL,
  },
  //
  // If you want to set up conformance statement with security enabled
  // Uncomment the following block
  //
  //   security: [
  //     {
  //       url: 'authorize',
  //       valueUri: `${env.AUTH_SERVER_URI}/authorize`,
  //     },
  //     {
  //       url: 'token',
  //       valueUri: `${env.AUTH_SERVER_URI}/token`,
  //     },
  //     // optional - registration
  //   ],
  //
  // Add any profiles you want to support.  Each profile can support multiple versions
  // if supported by core.  To support multiple versions, just add the versions to the array.
  //
  // Example:
  // Account: {
  //    service: './src/services/account/account.service.js',
  //    versions: [ VERSIONS['4_0_0'], VERSIONS['3_0_1'], VERSIONS['1_0_2'] ]
  // },
  //
  profiles: {
    patient: {
      service: './src/services/patient/index.js',
      versions: [VERSIONS['4_0_0']],
      metadata: path.join(__dirname, './metadata/patient.metadata.js'),
    },
    molecularsequence: {
      service: './src/services/molecularsequence/index.js',
      versions: [VERSIONS['4_0_0']],
    },
  },
};

module.exports = fhirServerConfig;
