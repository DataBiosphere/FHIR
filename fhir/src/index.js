require('dotenv').config();

const express = require('express');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { loggers } = require('@asymmetrik/node-fhir-server-core');

const fhirServerConfig = require('./config');
const { generateStatement } = require('./profiles/capabilitystatement');

const { PORT = 3000 } = process.env;

const logger = loggers.get();

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'up' });
});

const main = () => {
  const server = FHIRServer.initialize(
    {
      ...fhirServerConfig,
      statementGenerator: generateStatement,
    },
    app
  );
  server.listen(PORT, () => logger.info(`Broad FHIR listening on port ${PORT}`));
};

main();
