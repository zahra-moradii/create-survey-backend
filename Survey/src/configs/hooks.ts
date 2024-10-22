import * as fastify from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import logger from "../libraries/Logger";
const append = require("vary").append;

export default class CustomHooks {
  public app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

  constructor(
    apps: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>
  ) {
    this.app = apps;

    /**
     * Logging data when app has errors
     */
    // this.app.addHook('onError', async (request, reply, error) => {

    // });

    /**
     * Handle on request
     */
    this.app.addHook("onRequest", (request, reply, next) => {
      next();
    });

    this.app.addHook("onResponse", (request, reply, next) => {
      next();
    });

    this.app.addHook("onTimeout", (request, reply, next) => {
      if (process.env.LOG_HTTP_ENABLE === "YES")
        logger.info(request, request.ip, request.method);
      next();
    });

    //this.app.decorateRequest('user', () => {});

    this.app.addHook("onSend", async (req, reply) => {});

    /**
     * Pre handler
     * ? Pre handle means, checking JWT authorization status
     */
    this.app.addHook("preHandler", (req, res, next: (err?: Error) => void) => {
      const auth = req.headers["authorization"] as string;
      try {
        const token = auth.split(" ")[1];
        req["user"] = this.app.utils.verify(token);
        console.log("User Information : ", req["user"]);
      } catch (error) {}
      next();
    });
  }
}
