/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import AccountRepository from '../../repositories/account/accountRepository.js';
import PublishService from '../cubescan/publishService.js';
import AccountMovementService from './accountMovementService.js';

class AccountService {
  constructor() {
    this.publishService = new PublishService();
    this.accountRepository = new AccountRepository();
    this.accountMovementService = new AccountMovementService();
  }

  async addCredit(payload) {
    // const temp = await AccountQuery.accountById.resolve({ args: { _id } });
    logger.info('AccountService: addCredit');
    const { _id, value } = payload;
    const account = await this.findOneBy({ _id });

    const newBalance = account.balance + value;
    const accountToUpdate = {
      ...account.toObject(),
      balance: newBalance,
    };
    await this.accountMovementService.insert({
      serialNumber: account.serialNumber,
      value,
      type: typeMovement.CREDIT,
    });
    logger.debug(accountToUpdate);
    await this.accountRepository.updateOne(accountToUpdate);
    return accountToUpdate;
  }

  async getBalance(payload) {
    logger.info('AccountService: getBalance');
    const { serialNumber } = payload;
    const account = await this.findOneBy({ serialNumber });
    if (account) {
      const { topic } = payload;
      this.publishService.response(topic, { balance: account.balance });
    }
  }

  async findOneBy(clauses) {
    const result = await this.accountRepository.findOneBy(clauses);
    if (!result) {
      this.handleError('Not found account!');
    }
    return result;
  }

  async updateOne(payload) {
    const result = await this.accountRepository.updateOne(payload);
    return result;
  }

  handleError(error) {
    throw new UserInputError(error);
  }
}
export default AccountService;
