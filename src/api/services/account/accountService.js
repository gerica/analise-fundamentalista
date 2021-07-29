/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import AccountMovementRepository from '../../repositories/accountMovemintRepository.js';
import AccountRepository from '../../repositories/accountRepository.js';

class AccountService {
  static async updateCredit(payload) {
    logger.info('AccountService: updateCredit');
    const { serialNumber, balance } = payload;
    const account = await AccountRepository.findOneBy({ serialNumber });
    if (account) {
      const balanceInt = parseInt(balance, 10);
      account.balance += balanceInt;
      await AccountMovementRepository.insert({ serialNumber, value: balance });
      await AccountRepository.updateOne(account);
    }
  }
}
export default AccountService;
