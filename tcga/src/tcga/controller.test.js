jest.mock('./service', () => ({
  getAllDiagnosticReports: jest.fn().mockImplementation(() => [[{ id: 'gdc' }], 1]),
  getDiagnosticReportById: jest.fn().mockImplementation(() => ({ id: 'gdcid' })),
  getAllObservations: jest.fn().mockImplementation(() => [[{ id: 'diag' }], 2]),
  getObservationById: jest.fn().mockImplementation(() => ({ id: 'diagid' })),
  getAllSpecimen: jest.fn().mockImplementation(() => [[{ id: 'bio' }], 3]),
  getSpecimenById: jest.fn().mockImplementation(() => ({ id: 'bioid' })),
  getAllResearchStudies: jest.fn().mockImplementation(() => [[{ id: 'project' }], 4]),
  getResearchStudyById: jest.fn().mockImplementation(() => ({ id: 'projectid' })),
  getAllPatients: jest.fn().mockImplementation(() => [[{ id: 'patient' }], 5]),
  getPatientById: jest.fn().mockImplementation(() => ({ id: 'patientid' })),
}));

const controller = require('./controller');

describe('TCGA controller tests', () => {
  it('should get all Diagnostic Report data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllDiagnosticReports(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 1, results: [{ id: 'gdc' }] });
  });
  it('should get Diagnostic Report data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getDiagnosticReportById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'gdcid' });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 2, results: [{ id: 'diag' }] });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'diagid' });
  });

  it('should get all Specimen data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSpecimen(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 3, results: [{ id: 'bio' }] });
  });
  it('should get Specimen data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getSpecimenById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'bioid' });
  });

  it('should get all Research Study data', async () => {
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 4, results: [{ id: 'project' }] });
  });
  it('should get Research Study data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getResearchStudyById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'projectid' });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 5, results: [{ id: 'patient' }] });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'patientid' });
  });
});
