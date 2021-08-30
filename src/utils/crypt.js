/* eslint-disable no-async-promise-executor */
import { AuthenticationError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from './constants.js';
import logger from './logger.js';

class UtilCrypt {
  static async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
  }

  static async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  static getToken(payload, expiresIn = '2 days') {
    const token = jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn, //
    });
    return token;
  }

  static getPayload(token) {
    try {
      const payload = jsonwebtoken.verify(token, JWT_SECRET);
      return { loggedIn: true, payload };
    } catch (err) {
      // Add Err Message
      return { loggedIn: false };
    }
  }

  static guardAuth(loggedIn) {
    logger.debug('Guard Auth');
    if (!loggedIn) {
      throw new AuthenticationError('Please Login Again!');
    }
  }

  static userConfirmed(user) {
    logger.debug('User Confirmed');
    if (!user.confirmed) {
      throw new AuthenticationError('User not confirmed!');
    }
  }

  static async authMiddleware(resolve, source, args, context, info) {
    logger.info('✅ AuthMiddleware: guard Auth');
    const { loggedIn, user } = context;
    UtilCrypt.guardAuth(loggedIn);
    UtilCrypt.userConfirmed(user);
    return resolve(source, args, context, info);
  }

  static async deletedMiddleware(resolve, source, args, context, info) {
    logger.info('✅ AuthMiddleware: deletedMiddleware');
    const newArgs = { ...args };
    const { filter } = newArgs;
    if (!filter) {
      newArgs.filter = { deleted: false };
    } else {
      filter.deleted = false;
      newArgs.filter = filter;
    }
    return resolve(source, newArgs, context, info);
  }

  // static genPassword() {
  //   return Math.random().toString(36).slice(-8);
  // }
}

export default UtilCrypt;
