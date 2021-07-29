/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import AccountMovementRepository from '../../repositories/accountMovementRepository.js';
import AccountRepository from '../../repositories/accountRepository.js';
import PublishService from '../cubescan/publishService.js';

class AccountService {
  constructor() {
    this.publishService = new PublishService();
    this.accountRepository = new AccountRepository();
    this.accountMovementRepository = new AccountMovementRepository();
  }

  async updateCredit(payload) {
    logger.info('AccountService: updateCredit');
    const { serialNumber, balance } = payload;
    const account = await this.accountRepository.findOneBy({ serialNumber });
    if (account) {
      const balanceInt = parseInt(balance, 10);
      account.balance += balanceInt;
      await this.accountMovementRepository.insert({ serialNumber, value: balance });
      await this.accountRepository.updateOne(account);

      this.publishService.response(payload.topic, { balance: 100 });
    }
  }
}
export default AccountService;
