/* eslint-disable no-async-promise-executor */
import { AuthenticationError } from 'apollo-server-errors';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from './constants.js';
import logger from './logger.js';

class UtilCrypt {
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
    logger.info('Guard Auth');
    if (!loggedIn) {
      throw new AuthenticationError('Please Login Again!');
    }
  }

  static userConfirmed(user) {
    logger.info('User Confirmed');
    if (!user.confirmed) {
      throw new AuthenticationError('User not confirmed!');
    }
  }

  static async authMiddleware(resolve, source, args, context, info) {
    logger.info('AuthMiddleware: guard Auth');
    const { loggedIn, user } = context;
    UtilCrypt.guardAuth(loggedIn);
    UtilCrypt.userConfirmed(user);
    return resolve(source, args, context, info);
  }

  static async deletedMiddleware(resolve, source, args, context, info) {
    logger.info('authMiddleware: deletedMiddleware');
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
}

export default UtilCrypt;
