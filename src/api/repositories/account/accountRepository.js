import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { Account } from '../../models/account.js';

class AccountRepository {
  async findOneBy(payload) {
    logger.info('AccountRepository:findOneBy');
    let result;
    try {
      const query = { ...payload, deleted: false };
      result = await Account.findOne(query).exec();
      logger.debug(result);
    } catch (error) {
      this.handleError(error);
    }
    return result;
  }

  async updateOne(payload) {
    logger.info('AccountRepository:updateOne');
    try {
      // eslint-disable-next-line no-underscore-dangle
      await Account.updateOne({ _id: payload._id }, payload);
    } catch (error) {
      return this.handleError(error);
    }
    return 'Success';
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(error) {
    logger.error(error);
    return new UserInputError(error);
  }
}

export default AccountRepository;
