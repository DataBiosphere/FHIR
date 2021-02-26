const axios = require('axios');
const {
  workspaceFixture,
  // sampleFixture,
  subjectFixture,
} = require('../../../__fixtures__/anvilResponse');
const ANVIL = require('.');

jest.mock('axios');

describe('ANVIL service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all ANVIL ResearchStudy data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [workspaceFixture] } }));

    const anvil = new ANVIL();
    const [results, count] = await anvil.getAllResearchStudy({ page: 2, pageSize: 10 });

    expect(JSON.parse(JSON.stringify(results))).toEqual([
      {
        resourceType: 'ResearchStudy',
        id: 'AnVIL_CMG_Broad_Muscle_KNC_WES',
        meta: {
          profile: ['https://www.hl7.org/fhir/researchstudy.html'],
        },
        identifier: [
          {
            use: 'temp',
            system: 'https://anvil.terra.bio/#workspaces/anvil-datastorage/',
            value: 'AnVIL_CMG_Broad_Muscle_KNC_WES',
          },
        ],
        title: 'CMG_Broad_Muscle_KNC_WES',
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
          reference: 'Organization/Broad',
          type: 'Organization',
          display: 'Broad',
        },
        principalInvestigator: {
          reference: 'Practitioner/Nigel Clarke',
          type: 'Practitioner',
          display: 'Nigel Clarke',
        },
      },
    ]);

    expect(count).toEqual(10);
    // WARN: something is off with this
    expect(axios.get).toHaveBeenCalledWith('undefined/api/workspace', {
      params: { page: 2, pageSize: 10, offset: undefined, sort: undefined },
    });
  });

  it('should get all ANVIL Observation data', async () => {
    axios.get.mockImplementation(() => ({ data: { count: 10, results: [subjectFixture] } }));

    const anvil = new ANVIL();
    const [results, count] = await anvil.getAllObservations({ page: 2, pageSize: 10 });

    expect(JSON.parse(JSON.stringify(results))).toEqual([
      {
        resourceType: 'Observation',
        id: 'AnVIL_CMG_Broad_Muscle_KNC_WGS-Su-377HQ_LN_1',
        meta: {
          profile: ['https://www.hl7.org/fhir/observation.html'],
        },
        identifier: [
          {
            use: 'temp',
            system: 'urn:temp:unique-string',
            value: 'Observation-AnVILCMGBroadMuscleKNCWGS-Su-377HQLN1-OMIM310200',
          },
        ],
        status: 'final',
        code: {
          coding: [
            {
              system: 'http://purl.obolibrary.org/obo/omim.owl',
              code: 'OMIM:310200',
              display: 'Duchenne muscular dystrophy',
            },
          ],
          text: 'Duchenne muscular dystrophy',
        },
        subject: {
          reference: 'Patient/AnVIL_CMG_Broad_Muscle_KNC_WGS-Su-377HQ_LN_1',
        },
        valueCodeableConcept: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '373573001',
              display: 'Clinical finding present (situation)',
            },
          ],
          text: 'Phenotype Present',
        },
        interpretation: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: 'POS',
                display: 'Positive',
              },
            ],
            text: 'Present',
          },
        ],
      },
    ]);

    expect(count).toEqual(10);
    // WARN: something is off with this
    expect(axios.get).toHaveBeenCalledWith('undefined/api/subject', {
      params: { page: 2, pageSize: 10, offset: undefined, sort: undefined },
    });
  });
});
