jest.mock('./service', () => ({
  getAllResearchStudies: jest.fn().mockImplementation(() => [[{ id: 'workspace' }], 1]),
  getResearchStudyById: jest.fn().mockImplementation(() => ({ id: 'workspaceid' })),
  getAllSamples: jest.fn().mockImplementation(() => [[{ id: 'sample' }], 2]),
  getSampleById: jest.fn().mockImplementation(() => ({ id: 'sampleid' })),
  getAllPatients: jest.fn().mockImplementation(() => [[{ id: 'subject' }], 3]),
  getPatientById: jest.fn().mockImplementation(() => ({ id: 'subjectid' })),
  getAllObservations: jest.fn().mockImplementation(() => [[{ id: 'observation' }], 4]),
  getObservationById: jest.fn().mockImplementation(() => ({ id: 'observationid' })),
}));

const controller = require('./controller');

describe('ANVIL controller tests', () => {
  it('should get all ResearchStudy data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllResearchStudies(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 1, results: [{ id: 'workspace' }] });
  });

  it('should get ResearchStudy data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getResearchStudyById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'workspaceid' });
  });

  it('should get all Sample data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSamples(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 2, results: [{ id: 'sample' }] });
  });
  it('should get all Sample data with Workspace params', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foobar',
      },
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSamples(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 2, results: [{ id: 'sample' }] });
  });

  it('should get Sample data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getSampleById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'sampleid' });
  });
  it('should get Sample data by Workspace ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foo',
        id: 'bar',
      },
    };

    await controller.getSampleById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'sampleid' });
  });

  it('should get all Patient data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllPatients(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 3, results: [{ id: 'subject' }] });
  });
  it('should get all Patient data with Workspace params', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foobar',
      },
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllPatients(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 3, results: [{ id: 'subject' }] });
  });

  it('should get Patient data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getPatientById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'subjectid' });
  });
  it('should get Patient data by Workspace ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foo',
        id: 'bar',
      },
    };

    await controller.getPatientById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'subjectid' });
  });

  it('should get all Observation data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllObservations(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 4, results: [{ id: 'observation' }] });
  });
  it('should get all Observation data with Workspace params', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foobar',
      },
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllObservations(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 4, results: [{ id: 'observation' }] });
  });

  it('should get Observation data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getObservationById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'observationid' });
  });
  it('should get Observation data by Workspace ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foo',
        id: 'bar',
      },
    };

    await controller.getObservationById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'observationid' });
  });
});
