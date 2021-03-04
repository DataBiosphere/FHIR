const axios = require('axios');
const tcgaResponseFixture = require('../../../__fixtures__/tcgaResponse');
const TCGA = require('.');
const Translator = require('./translator');

jest.mock('axios');

// TODO: update TCGA tests
describe('TCGA service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all TCGA DiagnosticReport data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [tcgaResponseFixture] } }));

    const tcga = new TCGA();
    const [results, count] = await tcga.getAllDiagnosticReports({ page: 2, pageSize: 10 });

    expect(JSON.parse(JSON.stringify(results))).toEqual([
      {
        diagnosticReport: {
          category: [
            {
              coding: [
                {
                  code: 'GE',
                  display: 'Genetics',
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                },
              ],
            },
          ],
          extension: [
            {
              url: 'https://build.fhir.org/extension-workflow-researchstudy.html',
              valueReference: {
                reference: 'ResearchStudy/TCGA-HNSC',
                type: 'ResearchStudy',
              },
            },
          ],
          id: '291b069c-9dde-4e1e-8430-85146bc94338',
          issued: '2019-08-06T14:25:25.511101-05:00',
          meta: {
            profile: ['https://www.hl7.org/fhir/diagnosticreport-genetics.html'],
            source: 'TCGA-HNSC',
            versionId: '291b069c-9dde-4e1e-8430-85146bc94338',
          },
          resourceType: 'DiagnosticReport',
          result: [
            {
              display: 'Pharmaceutical Therapy, NOS',
              reference: 'Observation/e62a815e-6907-5bc7-acbc-932bc0a05b75',
            },
            {
              display: 'Radiation Therapy, NOS',
              reference: 'Observation/f46facb0-9a93-5077-a9b5-b8f907404520',
            },
          ],
          status: 'final',
          subject: {
            reference: 'Patient/2611cb61-6d05-5286-b94a-ce6cac2ba37b',
          },
        },

        observations: [
          {
            id: 'e62a815e-6907-5bc7-acbc-932bc0a05b75',
            identifier: [
              {
                system: 'https://portal.gdc.cancer.gov/projects/',
                value: 'TCGA-HNSC',
                use: 'official',
              },
            ],
            meta: {
              profile: ['https://www.hl7.org/fhir/observation.html'],
              source: 'TCGA-HNSC',
              versionId: 'e62a815e-6907-5bc7-acbc-932bc0a05b75',
            },
            code: {
              text: 'Pharmaceutical Therapy, NOS',
            },
            resourceType: 'Observation',
            status: 'final',
            subject: {
              reference: 'Patient/TCGA-CN-5363',
            },
            text: {
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Pharmaceutical Therapy, NOS</div>',
              status: 'generated',
            },
          },
          {
            id: 'f46facb0-9a93-5077-a9b5-b8f907404520',
            identifier: [
              {
                system: 'https://portal.gdc.cancer.gov/projects/',
                value: 'TCGA-HNSC',
                use: 'official',
              },
            ],
            meta: {
              profile: ['https://www.hl7.org/fhir/observation.html'],
              source: 'TCGA-HNSC',
              versionId: 'f46facb0-9a93-5077-a9b5-b8f907404520',
            },
            code: {
              coding: [
                {
                  code: '21880-0',
                  display: 'Radiation treatment therapy Cancer',
                  system: 'http://loinc.org/',
                },
              ],
              text: 'Radiation Therapy, NOS',
            },
            resourceType: 'Observation',
            status: 'final',
            subject: {
              reference: 'Patient/TCGA-CN-5363',
            },
            text: {
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Radiation Therapy, NOS</div>',
              status: 'generated',
            },
          },
        ],

        specimens: [
          {
            id: '591e99ec-46f9-442d-ac20-745dccc8a52b',
            meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Specimen'] },
            identifier: [
              {
                system: 'urn:ncpi:unique-string',
                value: 'Specimen|TCGA-HNSC|TCGA-HNSC-591e99ec-46f9-442d-ac20-745dccc8a52b',
              },
            ],
            subject: {
              reference: '291b069c-9dde-4e1e-8430-85146bc94338',
            },
            resourceType: 'Specimen',
          },
          {
            id: '5e4e1e21-8016-4e27-8f72-2411714203e8',
            meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Specimen'] },
            identifier: [
              {
                system: 'urn:ncpi:unique-string',
                value: 'Specimen|TCGA-HNSC|TCGA-HNSC-5e4e1e21-8016-4e27-8f72-2411714203e8',
              },
            ],
            subject: {
              reference: '291b069c-9dde-4e1e-8430-85146bc94338',
            },
            resourceType: 'Specimen',
          },
        ],
      },
    ]);
    expect(count).toEqual(10);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/gdc', {
      params: { page: 2, pageSize: 10 },
    });
  });

  it('should get TCGA data by case ID', async () => {
    axios.get.mockImplementation(() => ({ data: tcgaResponseFixture }));

    const tcga = new TCGA();
    const translator = new Translator();
    const results = await tcga.getDiagnosticReportById('foobar');

    expect(JSON.parse(JSON.stringify(results))).toEqual({
      diagnosticReport: {
        category: [
          {
            coding: [
              {
                code: 'GE',
                display: 'Genetics',
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              },
            ],
          },
        ],
        id: '291b069c-9dde-4e1e-8430-85146bc94338',
        issued: '2019-08-06T14:25:25.511101-05:00',
        meta: {
          profile: ['https://www.hl7.org/fhir/diagnosticreport-genetics.html'],
          source: 'TCGA-HNSC',
          versionId: '291b069c-9dde-4e1e-8430-85146bc94338',
        },
        resourceType: 'DiagnosticReport',
        result: [
          {
            display: 'Pharmaceutical Therapy, NOS',
            reference: 'Observation/e62a815e-6907-5bc7-acbc-932bc0a05b75',
          },
          {
            display: 'Radiation Therapy, NOS',
            reference: 'Observation/f46facb0-9a93-5077-a9b5-b8f907404520',
          },
        ],
        status: 'final',
        subject: {
          reference: 'Patient/2611cb61-6d05-5286-b94a-ce6cac2ba37b',
        },
        extension: [
          {
            url: 'https://build.fhir.org/extension-workflow-researchstudy.html',
            valueReference: {
              reference: 'ResearchStudy/TCGA-HNSC',
              type: 'ResearchStudy',
            },
          },
        ],
      },

      observations: [
        {
          id: 'e62a815e-6907-5bc7-acbc-932bc0a05b75',
          identifier: [
            {
              system: 'https://portal.gdc.cancer.gov/projects/',
              value: 'TCGA-HNSC',
              use: 'official',
            },
          ],
          meta: {
            profile: ['https://www.hl7.org/fhir/observation.html'],
            source: 'TCGA-HNSC',
            versionId: 'e62a815e-6907-5bc7-acbc-932bc0a05b75',
          },
          code: {
            text: 'Pharmaceutical Therapy, NOS',
          },
          resourceType: 'Observation',
          status: 'final',
          subject: {
            reference: 'Patient/TCGA-CN-5363',
          },
          text: {
            div: '<div xmlns="http://www.w3.org/1999/xhtml">Pharmaceutical Therapy, NOS</div>',
            status: 'generated',
          },
        },
        {
          id: 'f46facb0-9a93-5077-a9b5-b8f907404520',
          identifier: [
            {
              system: 'https://portal.gdc.cancer.gov/projects/',
              value: 'TCGA-HNSC',
              use: 'official',
            },
          ],
          meta: {
            profile: ['https://www.hl7.org/fhir/observation.html'],
            source: 'TCGA-HNSC',
            versionId: 'f46facb0-9a93-5077-a9b5-b8f907404520',
          },
          code: {
            coding: [
              {
                code: '21880-0',
                display: 'Radiation treatment therapy Cancer',
                system: 'http://loinc.org/',
              },
            ],
            text: 'Radiation Therapy, NOS',
          },
          resourceType: 'Observation',
          status: 'final',
          subject: {
            reference: 'Patient/TCGA-CN-5363',
          },
          text: {
            div: '<div xmlns="http://www.w3.org/1999/xhtml">Radiation Therapy, NOS</div>',
            status: 'generated',
          },
        },
      ],

      specimens: [
        {
          id: '591e99ec-46f9-442d-ac20-745dccc8a52b',
          meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Specimen'] },
          identifier: [
            {
              system: 'urn:ncpi:unique-string',
              value: 'Specimen|TCGA-HNSC|TCGA-HNSC-591e99ec-46f9-442d-ac20-745dccc8a52b',
            },
          ],
          subject: {
            reference: '291b069c-9dde-4e1e-8430-85146bc94338',
          },
          resourceType: 'Specimen',
        },
        {
          id: '5e4e1e21-8016-4e27-8f72-2411714203e8',
          meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Specimen'] },
          identifier: [
            {
              system: 'urn:ncpi:unique-string',
              value: 'Specimen|TCGA-HNSC|TCGA-HNSC-5e4e1e21-8016-4e27-8f72-2411714203e8',
            },
          ],
          subject: {
            reference: '291b069c-9dde-4e1e-8430-85146bc94338',
          },
          resourceType: 'Specimen',
        },
      ],
    });
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/gdc/foobar');
  });

  it('should get all Research Study data', async () => {
    axios.get.mockImplementation(() => ({ data: { results: [tcgaResponseFixture], count: 1 } }));

    const tcga = new TCGA();
    const translator = new Translator();
    const [_, count] = await tcga.getAllResearchStudy({ page: 1, pageSize: 1 });
    const results = translator.toResearchStudy(tcgaResponseFixture);

    expect(JSON.parse(JSON.stringify(results))).toEqual({
      resourceType: 'ResearchStudy',
      id: 'TCGA-HNSC',
      meta: {
        profile: ['https://www.hl7.org/fhir/researchstudy.html'],
      },
      identifier: [
        {
          use: 'temp',
          system: 'https://portal.gdc.cancer.gov/projects/',
          value: 'TCGA-HNSC',
        },
      ],
      title: 'Head and Neck Squamous Cell Carcinoma',
      status: 'completed',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              code: 'GE',
              display: 'Genetics',
            },
          ],
        },
      ],
      sponsor: {
        reference: 'Organization/The Cancer Genome Atlas',
        type: 'Organization',
        display: 'The Cancer Genome Atlas',
      },
    });

    expect(count).toEqual(1);
    expect(axios.get).toHaveBeenCalledWith('http://tcga/api/projects', {
      params: { page: 1, pageSize: 1 },
    });
  });
});
