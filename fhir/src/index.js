require('dotenv').config();

const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { loggers } = require('@asymmetrik/node-fhir-server-core');

const fhirServerConfig = require('./config');
const { generateStatement } = require('./profiles/capabilitystatement');

const { PORT = 3000 } = process.env;

const logger = loggers.get();

const main = () => {
  const server = FHIRServer.initialize({
    ...fhirServerConfig,
    statementGenerator: generateStatement,
  });
  server.listen(PORT, () => logger.info(`Broad FHIR listening on port ${PORT}`));
};

main();
