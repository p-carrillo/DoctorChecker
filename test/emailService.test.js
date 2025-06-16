const nodemailer = require('nodemailer');

const sendMailMock = jest.fn().mockResolvedValue(true);
const verifyMock = jest.fn().mockResolvedValue(true);

jest.mock('nodemailer');

// Mock logger
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  success: jest.fn()
}));

// Provide custom config
jest.mock('../src/config/config', () => ({
  email: {
    smtp: {},
    from: 'from@test.com',
    users: ['user1@test.com', 'user2@test.com'],
    admins: ['admin@test.com']
  }
}));

nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock,
  verify: verifyMock
});

const EmailService = require('../src/services/emailService');

describe('EmailService', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    verifyMock.mockClear();
  });

  test('sendDoctorAvailableNotification sends an email', async () => {
    const service = new EmailService();
    const cupo = { name: 'Doc', cupoId: '1', estado: 'LIBRE', url: 'http://test' };
    const result = await service.sendDoctorAvailableNotification(cupo);

    expect(sendMailMock).toHaveBeenCalled();
    expect(sendMailMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        to: 'user1@test.com, user2@test.com',
        from: 'from@test.com'
      })
    );
    expect(result).toBe(true);
  });

  test('testConnection verifies transporter', async () => {
    const service = new EmailService();
    const result = await service.testConnection();
    expect(verifyMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
