const axios = require('axios');
const cheerio = require('cheerio');

jest.mock('axios');

// Mock logger to silence output during tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  success: jest.fn()
}));

const SergasService = require('../src/services/sergasService');

describe('SergasService', () => {
  let service;

  beforeEach(() => {
    service = new SergasService();
    axios.get.mockReset();
  });

  test('parseDoctorInfo extracts data from HTML', () => {
    const html = `
      <input name="nomemedico" value="Dr. Test" />
      <input type="text" value="PECHADO" />
    `;
    const $ = cheerio.load(html);
    const info = service.parseDoctorInfo($, '123');

    expect(info).toEqual({
      cupoId: '123',
      name: 'Dr. Test',
      estado: 'PECHADO',
      isAvailable: false,
      url: expect.any(String)
    });
  });

  test('checkCupoStatus returns info when status changes', async () => {
    axios.get.mockResolvedValueOnce({ data: '<input name="nomemedico" value="Doc" /><input type="text" value="PECHADO" />' });
    let result = await service.checkCupoStatus('123');
    expect(result).toBeNull();

    axios.get.mockResolvedValueOnce({ data: '<input name="nomemedico" value="Doc" /><input type="text" value="LIBRE" />' });
    result = await service.checkCupoStatus('123');
    expect(result).not.toBeNull();
    expect(result.estado).toBe('LIBRE');
  });
});
