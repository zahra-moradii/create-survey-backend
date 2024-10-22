import * as fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import utilities from "../utils"
import autoload from '../utils/Autoload';
import { join } from 'path';
import database from '../database';
import cors from '@fastify/cors'

export default class CustomPlugins {
  public app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

  constructor(
    apps: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>,
  ) {
    this.app = apps;

    // this.app.register(cors.default, {
    //   preflight: true,
    //   credentials: true,
  
    // register routes
    this.app.register(autoload, {
      dir: join(__dirname, '..', 'routes'),
      // includeTypeScript: true,
    });

    this.app.register(utilities);
    this.app.register(database)
    this.app.register(cors)
    // this.app.listen({port : 4200})
    // const fastify = Fastify()
    // fastify.register(cors)
  
    
    
  }
}
