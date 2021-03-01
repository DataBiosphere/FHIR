const axios = require('axios');
const {
  workspaceFixture,
  observationFixture,
  patientFixture,
} = require('../../../__fixtures__/anvilResponse');
const ANVIL = require('./index');
const Translator = require('./translator');

jest.mock('axios');

// TODO: figure out how to test without using Translator
describe('ANVIL service tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get all ANVIL ResearchStudy data', async () => {
    axios.get.mockImplementationOnce(() => ({ data: { count: 10, results: [] } }));

    const anvil = new ANVIL();
    const translator = new Translator();
    const [_, count] = await anvil.getAllResearchStudy({ page: 2, pageSize: 10 });
    const results = translator.toResearchStudy(workspaceFixture);

    expect(JSON.parse(JSON.stringify(results))).toEqual({
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
    });

    expect(count).toEqual(10);
  });

  it('should get all ANVIL Observation data', async () => {
    axios.get.mockImplementation(() => ({
      data: { count: 10, results: [observationFixture] },
    }));

    const anvil = new ANVIL();
    const translator = new Translator();
    let [_, count] = await anvil.getAllObservations({ page: 2, pageSize: 10 });
    const results = translator.toObservation(observationFixture);

    expect(JSON.parse(JSON.stringify(results))).toEqual({
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
    });

    expect(count).toEqual(10);
  });

  it('should get all ANVIL Patient data', async () => {
    axios.get.mockImplementationOnce(() => ({ data: { count: 10, results: [patientFixture] } }));

    const anvil = new ANVIL();
    const translator = new Translator();
    const [_, count] = await anvil.getAllPatients({ page: 2, pageSize: 10 });
    const results = translator.toPatient(patientFixture);

    expect(JSON.parse(JSON.stringify(results))).toEqual({
      resourceType: 'Patient',
      id: 'AnVIL_CMG_UWash_GRU-Su-sub-102859',
      meta: {
        profile: ['https://www.hl7.org/fhir/patient.html'],
      },
      identifier: [
        {
          use: 'temp',
          system: 'urn:temp:unique-string',
          value: 'Patient-AnVILCMGUWashGRU-Su-sub-102859',
        },
      ],
      gender: 'female',
    });

    expect(count).toEqual(10);
  });
});
