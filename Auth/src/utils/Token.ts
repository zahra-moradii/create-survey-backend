import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { configs } from '../configs';
import { IUser } from '../models/User';
/**
 * Payload expected by JWT's sign token function.
 *
 * @interface IJWTPayload
 */
export interface IJWTPayload {
  userName: string;
  roles: string[];
  permissions: string[];
  profiles:any;
  _id: ObjectId;
}

export interface IJWTToken {
  sign: (options: IJWTPayload) => string;
  verify: (token: string) => IJWTPayload;
}

/**
 * JWT tokens signing, verification and decoding utility.
 *
 * @export
 * @class Token
 */
export const JWTToken = {
  /**
   * Use JWT to sign a token
   */
  sign: (options: IJWTPayload) => {
    console.log('options',options)
    const {
      userName,
      roles,
      permissions,
      profiles,
      _id
    }: IJWTPayload = options;
    if (!userName || !roles || !permissions || !profiles || !_id ) {
      throw new Error('Expects userName,roles and permissions in payload.');
    }

    return jwt.sign(
      { userName, roles, permissions,profiles,_id },
      configs.jwtsecret,
      {
        expiresIn: '7d',
      },
    );
  },
  /**
   * Verify token, and get passed in variables
   */
  verify: (token: string) => {
    try {
      return jwt.verify(token.split(" ")[1], configs.jwtsecret) as IJWTPayload;
    } catch (error) {
      return {
        userName: null,
        roles: [],
        permissions: [],
        profiles : null,
        _id : null
      };
    }
  },
};
