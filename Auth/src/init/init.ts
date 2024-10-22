import * as fastify from 'fastify';
import cluster from 'cluster';
import * as os from 'os';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { join, resolve } from 'path';
import logger from '../libraries/Logger';
import CustomPlugins from '../configs/plugins';
import CustomHooks from '../configs/hooks';

const settings = require(join(__dirname, '..', '..', 'settings.json'));
const fs = require('fs');
const path = require('path');
const ops = require('ops-error');

ops.config({
  useDebug: true,
  useErrorResponse: true,
  useLogging: (log) => {
    // logger.error(
    //   log,
    //   `Internal Server Error - ${log.statusCode} :`,
    //   '',
    //   'CONSOLE',
    // );
    ops.print(log);
    // saveLogErrorAsString(JSON.stringify(log));
  },
});

export default class Init {
  public app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
  private port: any;

  constructor() {
    // this.folderCreateCheck();
    this.port = parseInt(process.env.PORT);
    this.app = fastify.fastify({
      pluginTimeout: 3000,
      caseSensitive: false,
      ignoreTrailingSlash: true,
      logger: {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          }},
        serializers: {
          res(reply) {
            return {
              statusCode: reply.statusCode,
            };
          },
          req(request) {
            return {
              method: request.method,
              url: request.url,
              path: request.url,
              parameters: request.routerPath,
              headers: request.headers,
            };
          },
        },
      },
    });
    this.config();
  }

  public async start() {
    await this.startListening();

    logger.success(
      {},
      'Server listening on port' +
        ' ' +
        JSON.stringify(this.app.server.address()),
      '',
    );
  }

  private async startListening() {
    return await this.app
      .listen({ port: this.port, host: '0.0.0.0' })
      .catch((error) => {
        console.log(error)
        logger.error(error, error.message, '', 'CONSOLE');
      });
  }
  private config() {
    this.errorHandler();
    new CustomHooks(this.app);
    new CustomPlugins(this.app);
  }

  private errorHandler() {
    process.on('uncaughtException', (error) => {
      logger.error(
        error,
        `uncaughtException - ${error.message}`,
        '',
        'CONSOLE',
      );
    });
    process.on('unhandledRejection', (reason, promise) => {
      logger.error(
        {},
        'Unhandled Rejection at:' +
          ' ' +
          JSON.stringify(promise) +
          ' ' +
          'reason:' +
          JSON.stringify(promise),
        '',
        'CONSOLE',
      );
    });

    this.app.setErrorHandler(async (error, request, reply) => {
      const data = ops.getError(error, request);
      reply.code(data.statusCode).send(data);
    });
  }

  // private folderCreateCheck() {
  //   if (!fs.existsSync(path.join(path.resolve('./'), process.env.UPLOAD_URL))) {
  //     const dir1 = './uploads/ticketAttachments';
  //     const dir2 = './uploads/userProfile';
  //     const dir3 = './uploads/other';

  //     fs.mkdirSync(dir1, { recursive: true });
  //     fs.mkdirSync(dir2, { recursive: true });
  //     fs.mkdirSync(dir3, { recursive: true });
  //     logger.info({}, 'Uploads directory fully created.', '', 'CONSOLE');
  //   }
  // }

  private async workerProcesses() {
    const cpus = os.cpus();

    for (const _cpu in cpus) {
      cluster.fork();
    }

    cluster.on('exit', async (_worker) => {
      cluster.fork();
    });
  }
}
