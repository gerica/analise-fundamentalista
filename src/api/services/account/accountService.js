/* eslint-disable class-methods-use-this */
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
    const account = await this.accountRepository.findOneBy({ serialNumber });
    if (account) {
      const { results } = payload;
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
        this.publishService.response(payload.topic, { balance: account.balance });
      }
    }
  }
}
export default AccountService;
