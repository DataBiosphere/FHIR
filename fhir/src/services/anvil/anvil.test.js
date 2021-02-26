const axios = require('axios');
const {
  workspaceFixture,
  sampleFixture,
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
    // something is off with this
    expect(axios.get).toHaveBeenCalledWith('undefined/api/workspace', {
      params: { page: 2, pageSize: 10, offset: undefined, sort: undefined },
    });
  });
});
