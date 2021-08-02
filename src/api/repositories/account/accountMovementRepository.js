/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { AccountMovement } from '../../models/accountMovement.js';

class AccountMovementRepository {
  async insert(payload) {
    logger.info('AccountMovementRepository:insert');
    let result;
    try {
      result = new AccountMovement({ ...payload });
      await result.save();
      logger.debug(`${result.id} documents were inserted with the _id: ${result.id}`);
    } catch (error) {
      return this.handleError(error);
    }
    return result;
  }

  async findManyBy(payload) {
    logger.info('AccountMovementRepository: findOneBy');
    let result;
    try {
      const query = { ...payload, deleted: false };
      result = await AccountMovement.find(query).exec();
      logger.debug(result);
    } catch (error) {
      this.handleError(error);
    }
    return result;
  }

  handleError(error) {
    throw new UserInputError(error);
  }
}

export default AccountMovementRepository;
