/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import AccountRepository from '../../repositories/account/accountRepository.js';
import PublishService from '../cubescan/publishService.js';
import ExamResultService from '../exam/examResultService.js';
import AccountMovementService from './accountMovementService.js';

class AccountService {
  constructor() {
    this.publishService = new PublishService();
    this.accountRepository = new AccountRepository();
    this.accountMovementService = new AccountMovementService();
    this.examResultService = new ExamResultService();
  }

  async updateCredit(payload) {
    logger.info('AccountService: updateCredit');
    const { serialNumber } = payload;
    const account = await this.findOneBy({ serialNumber });
    if (account) {
      const { results, topic } = payload;
      if (results && results.length > 0) {
        const countExams = results.length;
        await this.examResultService.insertMany(serialNumber, results);
        const balanceInt = countExams;
        account.balance -= balanceInt;
        if (account.balance < 0) {
          account.balance = 0;
        }
        await this.accountMovementService.insert({
          serialNumber,
          value: countExams,
          type: typeMovement.DEBIT,
        });
        await this.accountRepository.updateOne(account);
        this.publishService.response(topic, { balance: account.balance });
      }
    }
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
    logger.info(accountToUpdate);
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

  handleError(error) {
    throw new UserInputError(error);
  }
}
export default AccountService;
