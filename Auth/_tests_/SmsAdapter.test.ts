import SmsAdapter from '../src/utils/SmsAdapter';
import { sendSms } from '../src/utils/sms';
require('dotenv').config();

describe('Sms Adapter', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  }),
    it('should send sms', async () => {
      const adapter = new SmsAdapter();
      const spy = jest.spyOn(adapter, 'send');
      expect(jest.fn(sendSms)).not.toHaveBeenCalled();
      adapter.send('test', '09304285854');

      expect(spy).toHaveBeenCalled();
    });
  jest.autoMockOn;
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
