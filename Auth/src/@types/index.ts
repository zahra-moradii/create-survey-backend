import { FastifyInstance, FastifyRequest as Request } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { FastifyReply } from 'fastify/types/reply';
import { IUtilities } from '../utils';
import { IDatabase } from '../database';

interface IUserCredentials {
  id: string;
  userName: string;
  roles: [];
  permissions: [];
  profiles: string;
  submission: string;
}

export type RouteFactory = (
  app: FastifyInstance,
) => (
  request: Request<RouteGenericInterface, Server, IncomingMessage>,
  reply: FastifyReply<
    Server,
    IncomingMessage,
    ServerResponse,
    RouteGenericInterface
  >,
) => Promise<any>;

declare module 'fastify' {
  export interface FastifyInstance {
    db: IDatabase;
    utils: IUtilities;
  }
}
interface FastifyRequest {
  user: IUserCredentials;
}
