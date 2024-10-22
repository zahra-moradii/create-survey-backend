// import { it, expect, describe, afterAll, beforeAll } from 'vitest';
import CV from '../src/utils/CodeVerification';
import Server from '../src/init/init';

const EXPIRETIME = 200;
const CODELENGTH = 7;

const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });

describe('Code Verifiication', () => {
  it('should send request to server', async () => {
    const fastify = new Server().app;
    const email = "sample@yahoo.com"

    jest.setTimeout(20000);
    jest.mock('nodemailer')

    const res = await fastify.inject({
      method: 'POST',
      url: '/verification/send',
      headers: { 'Accept-Version': '1.0.0' },
      payload: { email },
    });
    console.log(res.payload)
    expect(JSON.parse(res.payload)[email]['expire']).toBe(
      +process.env.CODE_EXPIRE_TIME!,
    );
  });

  it('should create code', async () => {
    const cv = new CV();
    const code = await cv.createCode('t@t.c', CODELENGTH, EXPIRETIME);

    expect(code.length).toBe(CODELENGTH);
    expect(typeof code).toBe('string');
  });

  it('should create code then verify code', async () => {
    const cv = new CV();
    const key = 't2@t.c';
    const code = await cv.createCode(key, CODELENGTH, EXPIRETIME);

    expect(typeof code).toBe('string');

    const successResult = await cv.verifyCode(key, code);

    expect(successResult).toBe(true);
  });

  it('should return false if code is wrong', async () => {
    const cv = new CV();
    const key = 't3@t.c';
    const code = await cv.createCode(key, CODELENGTH, EXPIRETIME);

    expect(typeof code).toBe('string');

    const failResult = await cv.verifyCode(key, code + 1); // '+1' just for create wrong code
    expect(failResult).toBe(false);
  });

  it('should return false if code expired', async () => {
    const cv = new CV();
    const key = 't2@t.c';
    const codeExpireTime = 2;
    const code = await cv.createCode(key, CODELENGTH, codeExpireTime);

    expect(typeof code).toBe('string');
    await sleep(codeExpireTime + 1);

    const result = await cv.verifyCode(key, code);

    expect(result).toBe(false);
  });
});
