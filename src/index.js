require('dotenv').config();

const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

const fhirServerConfig = require('./config');
const { generateStatement } = require('./profiles/capabailitystatement');

const main = async () => {
  const server = FHIRServer.initialize({
    ...fhirServerConfig,
    statementGenerator: generateStatement,
  });
  server.listen(3000, () => logger.info('Server is up and running'));
};

main();
