import { FastifyInstance } from 'fastify';
import {
  metrics as monitoringMetrics,
  contentType,
} from '@isdynamic-co/cloudcrmsharedpkg/utils/monitoring/metrics';

export const setMetricsRoutes = (app: FastifyInstance) => {
  app.get('/metrics', async (_, reply) => {
    reply.headers({ 'Content-Type': contentType });
    return reply.code(200).send(await monitoringMetrics());
  });
};
