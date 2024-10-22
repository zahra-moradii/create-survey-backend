import Server from '../src/init/init';
import { expect } from 'chai';

const fastify = new Server().app;

after(() => fastify.close(() => null));

describe('should authorize user and give token', () => {
    it('should return authorization token', async () => {
        try {
            const res = await fastify.inject({ method: 'POST', url: '/auth/sign-in', payload: { email: 'sample@email.com', password: 'samplepwd' } });

            expect(JSON.parse(res.payload)['token']).not.to.be.undefined;
            expect(res.statusCode).to.be.equal(200);
        } catch (er) {
            expect(er).to.be.false;
        }
    });
});
function after(arg0: () => import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>) {
  throw new Error('Function not implemented.');
}

