import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IJWTPayload } from '../utils/Token';
import * as _ from 'lodash';
/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function determineAccountAndUser(
  app: FastifyInstance,
  req: FastifyRequest,
): IJWTPayload {
  const auth = req.headers['authorization'] as string;
  try {
    const token = auth.split(' ')[1];
    return app.utils.verify(token);
  } catch (error) {
    return null;
  }
}

/**
 * Prehandler hook,
 *  - For example Protect all resources accessible to super admin only
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 */
export function protectUserRoute(
  app: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply,
  done: (err?: Error) => void,
): any {
  const auth = req.headers['authorization'] as string;

  if (!auth) {
    return res
      .status(401)
      .send({ error: 'unauthorized', message: 'Missing authentication token' });
  }

  const verifyResult = determineAccountAndUser(app, req);

  if (
    !verifyResult.userName ||
    !verifyResult.permissions ||
    !verifyResult.roles ||
    !verifyResult._id ||
    !verifyResult.profiles
  ) {
    return res.status(403).send({
      error: 'forbidden',
      message: 'Invalid credentials in authentication token',
    });
  }

  return done();
}

/**
 * Allow authorized user to access resource, without narrowing scope to role/account
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 * @param {(err?: Error) => void} done
 * @returns
 */
export function protectAuthorizedUser(
  app: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply,
  roles: string[],
  permissions: string[],
  done: (err?: Error) => void,
): any {
  const auth = req.headers['authorization'] as string;

  if (!auth) {
    return res
      .status(401)
      .send({ error: 'unauthorized', message: 'Missing authentication token' });
  }

  const verifyResult = determineAccountAndUser(app, req);

  if (
    !verifyResult.userName ||
    !verifyResult.permissions ||
    !verifyResult.roles ||
    !verifyResult._id ||
    !verifyResult.profiles
  ) {
    return res.status(403).send({
      error: 'forbidden',
      message: 'Invalid credentials in authentication token',
    });
  }

  //Based on roles
  if (roles && roles.length > 0) {
    if (
      roles
        .map((x) => x.toLowerCase())
        .filter((e) =>
          verifyResult.roles.map((x) => x.toLowerCase()).includes(e),
        ).length === 0
    ) {
      return res.status(401).send({
        error: 'unauthorized',
        message: 'Permission denined',
      });
    }
  }

  //Based on permissions
  if (permissions && permissions.length > 0) {
    if (
      permissions
        .map((x) => x.toLowerCase())
        .filter((e) =>
          verifyResult.permissions.map((x) => x.toLowerCase()).includes(e),
        ).length === 0
    ) {
      return res.status(401).send({
        error: 'unauthorized',
        message: 'Permission denined',
      });
    }
  }
  return done();
}
