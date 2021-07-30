/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import AccountMovementRepository from '../../repositories/account/accountMovementRepository.js';
import AccountRepository from '../../repositories/account/accountRepository.js';
import PublishService from '../cubescan/publishService.js';
import ExamResultService from '../exam/examResultService.js';

class AccountService {
  constructor() {
    this.publishService = new PublishService();
    this.accountRepository = new AccountRepository();
    this.accountMovementRepository = new AccountMovementRepository();
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
}
export default AccountService;
