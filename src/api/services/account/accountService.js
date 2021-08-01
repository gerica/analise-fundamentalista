/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { AccountTC } from '../../models/account.js';
import { typeMovement } from '../../models/accountMovement.js';
import AccountMovementRepository from '../../repositories/account/accountMovementRepository.js';
import AccountRepository from '../../repositories/account/accountRepository.js';
import PublishService from '../cubescan/publishService.js';
import ExamResultService from '../exam/examResultService.js';
import AccountMovementService from './accountMovementService.js';

class AccountService {
  constructor() {
    this.publishService = new PublishService();
    this.accountRepository = new AccountRepository();
    this.accountMovementRepository = new AccountMovementRepository();
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
        await this.accountMovementRepository.insert({
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
    logger.info('AccountService: addCredit');
    const { _id, value } = payload;
    const account = await this.findOneBy({ _id });
    if (!account) {
      this.handleError('Anyone account with this id');
    }
    const updateAccountTC = AccountTC.getResolver('updateById', [this.accountMovementService.insertByMiddleware]);
    const newBalance = account.balance + value;
    const accountToUpdate = {
      _id,
      record: { ...account.toObject(), balance: newBalance },
    };
    updateAccountTC.resolve({ args: accountToUpdate });
    logger.info(accountToUpdate.record);

    return accountToUpdate.record;
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
    if (result) {
      return result;
    }
    return new UserInputError('Not found account!');
  }

  static handleError(error) {
    return new UserInputError(error);
  }
}
export default AccountService;
