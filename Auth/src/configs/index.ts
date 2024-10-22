import { FastifyInstance } from "fastify";
import * as fp from "fastify-plugin";
import { IncomingMessage, Server, ServerResponse } from "http";
import { config } from "dotenv";

config();

const production = process.env.NODE_ENV === `Production`;

export interface IConfig {
  jwtsecret: string;
}
/**
 * Application Configuration
 * ? In this point, Configuration Database conenction settting, Mail settings and jwt config
 */

export const configs: IConfig = {
  jwtsecret: process.env.JWT_SECRET_KEY,
};

export default fp.default(
  (
    app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    opts: {},
    done: (err?: Error) => void
  ) => {
    app.decorate(`config`, configs);
    done();
  }
);
