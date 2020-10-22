require('dotenv').config({ path: '.env.test' });
require('@asymmetrik/node-fhir-server-core').loggers.initialize({ level: 10 }); // disable logging to not clutter test output
