const tcgaResults = require('../../__fixtures__/tcga/tcgaresults.json');

const BigQuery = require('../services/BigQuery');

jest.mock('../services/BigQuery');

BigQuery.mockImplementation(() => ({
  get: () => [tcgaResults, 10],
}));

const service = require('./service');

// TODO: update tests to include Patient
describe('service tests', () => {
  it('should getByID', async () => {
    const result = await service.getDiagnosticReportById('foobar');
    expect(JSON.parse(JSON.stringify(result))).toEqual({
        "resourceType": "DiagnosticReport",
        "id": "291b069c-9dde-4e1e-8430-85146bc94338",
        "meta": {
          "versionId": "291b069c-9dde-4e1e-8430-85146bc94338",
          "source": "TCGA-HNSC",
          "profile": [
            "https://www.hl7.org/fhir/diagnosticreport-genetics.html"
          ]
        },
        "extension": [
          {
            "url": "https://build.fhir.org/extension-workflow-researchstudy.html",
            "valueReference": {
              "reference": "ResearchStudy/TCGA-HNSC",
              "type": "ResearchStudy"
            }
          }
        ],
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
                "code": "GE",
                "display": "Genetics"
              }
            ]
          }
        ],
        "subject": {
          "reference": "Patient/2611cb61-6d05-5286-b94a-ce6cac2ba37b"
        },
        "issued": "2019-08-06T14:25:25.511101-05:00",
        "result": [
          {
            "reference": "Observation/e62a815e-6907-5bc7-acbc-932bc0a05b75",
            "display": "Pharmaceutical Therapy, NOS"
          },
          {
            "reference": "Observation/f46facb0-9a93-5077-a9b5-b8f907404520",
            "display": "Radiation Therapy, NOS"
          }
        ]
      });
  });

  it('should getAll', async () => {
    const [results, count] = await service.getAllDiagnosticReports();
    expect(JSON.parse(JSON.stringify(results))).toEqual([
        {
          resourceType: "DiagnosticReport",
          id: "291b069c-9dde-4e1e-8430-85146bc94338",
          meta: {
            versionId: "291b069c-9dde-4e1e-8430-85146bc94338",
            source: "TCGA-HNSC",
            profile: [
              "https://www.hl7.org/fhir/diagnosticreport-genetics.html"
            ]
          },
          extension: [
            {
              url: "https://build.fhir.org/extension-workflow-researchstudy.html",
              valueReference: {
                reference: "ResearchStudy/TCGA-HNSC",
                type: "ResearchStudy"
              }
            }
          ],
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                  code: "GE",
                  display: "Genetics"
                }
              ]
            }
          ],
          subject: {
            reference: "Patient/2611cb61-6d05-5286-b94a-ce6cac2ba37b"
          },
          issued: "2019-08-06T14:25:25.511101-05:00",
          result: [
            {
              reference: "Observation/e62a815e-6907-5bc7-acbc-932bc0a05b75",
              display: "Pharmaceutical Therapy, NOS"
            },
            {
              reference: "Observation/f46facb0-9a93-5077-a9b5-b8f907404520",
              display: "Radiation Therapy, NOS"
            }
          ]
        }
      ]);
  });

  it('should getAllSpecimen', async () => {
    const [results, count] = await service.getAllSpecimen();
    expect(JSON.parse(JSON.stringify(results))).toEqual([{
      id: "5e4e1e21-8016-4e27-8f72-2411714203e8",
      identifier: [{
        system: "urn:ncpi:unique-string",
        value: "Specimen|TCGA-HNSC|TCGA-HNSC-5e4e1e21-8016-4e27-8f72-2411714203e8"
      }],
      meta: {
        profile: ["http://hl7.org/fhir/StructureDefinition/Specimen"]
      },
      resourceType: "Specimen",
      subject: {
        reference: "291b069c-9dde-4e1e-8430-85146bc94338"
      }
    },
    {
      id: "591e99ec-46f9-442d-ac20-745dccc8a52b",
      identifier: [{
        system: "urn:ncpi:unique-string",
        value: "Specimen|TCGA-HNSC|TCGA-HNSC-591e99ec-46f9-442d-ac20-745dccc8a52b"
      }],
      meta: {
        profile: ["http://hl7.org/fhir/StructureDefinition/Specimen"]
      },
      resourceType: "Specimen",
      subject: {
        reference: "291b069c-9dde-4e1e-8430-85146bc94338"
      }
    },
    {
      id: "5e4e1e21-8016-4e27-8f72-2411714203e8",
      identifier: [{
        system: "urn:ncpi:unique-string",
        value: "Specimen|TCGA-HNSC|TCGA-HNSC-5e4e1e21-8016-4e27-8f72-2411714203e8"
      }],
      meta: {
        profile: ["http://hl7.org/fhir/StructureDefinition/Specimen"]
      },
      resourceType: "Specimen",
      subject: {
        reference: "291b069c-9dde-4e1e-8430-85146bc94338"
      }
    },
    {
      id: "591e99ec-46f9-442d-ac20-745dccc8a52b",
      identifier: [{
        system: "urn:ncpi:unique-string",
        value: "Specimen|TCGA-HNSC|TCGA-HNSC-591e99ec-46f9-442d-ac20-745dccc8a52b"
      }],
      meta: {
        profile: ["http://hl7.org/fhir/StructureDefinition/Specimen"]
      },
      resourceType: "Specimen",
      subject: {
        reference: "291b069c-9dde-4e1e-8430-85146bc94338"
      }
    }
  ]);
  });

  it('should getSpecimenById', async () => {
    const result = await service.getSpecimenById();
    expect(JSON.parse(JSON.stringify(result))).toEqual({
        resourceType: 'Specimen',
        id: '5e4e1e21-8016-4e27-8f72-2411714203e8',
        meta: { profile: [ 'http://hl7.org/fhir/StructureDefinition/Specimen' ] },
        identifier: [
          {
            system: 'urn:ncpi:unique-string',
            value: 'Specimen|TCGA-HNSC|TCGA-HNSC-5e4e1e21-8016-4e27-8f72-2411714203e8'
          }
        ],
        subject: { reference: '291b069c-9dde-4e1e-8430-85146bc94338' }
      });
  });
});
