require('dotenv').config();
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

const fhirServerConfig = require('./config');

const main = async () => {
  // Start our FHIR server
  const server = FHIRServer.initialize(fhirServerConfig);
  server.listen(fhirServerConfig.server.port, () => logger.verbose('Server is up and running!'));
};

main();
