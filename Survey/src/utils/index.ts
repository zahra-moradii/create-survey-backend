import { FastifyInstance } from "fastify";
import * as fp from "fastify-plugin";
import { IJWTToken, JWTToken } from "./Token";
// tslint:disable-next-line: no-empty-interface
export interface IUtilities extends IJWTToken {}

export default fp.default(
  (app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    app.decorate("utils", {
      ...JWTToken,
    });
    // pass execution to the next middleware in fastify instance
    done();
  }
);
