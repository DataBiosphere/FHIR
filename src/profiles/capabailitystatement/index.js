const { VERSIONS } = require('@asymmetrik/node-fhir-server-core/dist/constants');
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const makeStatement = (resources) => {
  let CapabilityStatement = resolveSchema(VERSIONS['4_0_0'], 'CapabilityStatement');

  return new CapabilityStatement({
    status: 'draft',
    date: '20201013',
    publisher: 'The Publisher',
    kind: 'instance',
    software: {
      name: 'Broad',
      version: '1.0.0',
      releaseDate: '20201013',
    },
    implementation: {
      description: 'Broad FHIR Server',
    },
    fhirVersion: 'r4',
    acceptUnknown: 'extensions',
    format: ['application/fhir+json'],
    rest: resources,
  });
};

const securityStatement = (securityUrls) => {
  return {
    cors: true,
    service: [
      {
        coding: [
          {
            system: 'http://hl7.org/fhir/restful-security-service',
            code: 'SMART-on-FHIR',
          },
        ],
        text: 'Custom OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)',
      },
    ],
    extension: [
      {
        url: 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',
        extension: securityUrls,
      },
    ],
  };
};

const generateStatement = (args) => {
  return {
    makeStatement,
    securityStatement,
  };
};

module.exports = {
  makeStatement,
  securityStatement,
  generateStatement,
};
