export const mockNotificationService = {
  sendEmailConfirmationCode: jest.fn().mockResolvedValue(true),
  sendRecoveryPasswordTempCode: jest.fn().mockResolvedValue(true),
}
