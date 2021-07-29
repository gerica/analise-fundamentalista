import { UserInputError } from 'apollo-server-errors';
import logger from '../../utils/logger.js';
import { AccountMovement } from '../models/accountMovement.js';

class AccountMovementRepository {
  async insert(payload) {
    logger.info('AccountMovementRepository:insert');
    let result;
    try {
      result = new AccountMovement({ ...payload });
      await result.save();
      logger.info(`${result.id} documents were inserted with the _id: ${result.id}`);
    } catch (error) {
      return this.handleError(error);
    }
    return result;
  }

  static handleError(error) {
    return new UserInputError(error);
  }
}

export default AccountMovementRepository;
