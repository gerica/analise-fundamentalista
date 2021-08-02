/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import AccountMovementRepository from '../../repositories/account/accountMovementRepository.js';

class AccountMovementService {
  constructor() {
    this.accountMovementRepository = new AccountMovementRepository();
  }

  async insertByMiddleware(resolve, source, args, context, info) {
    logger.info('AccountMovementService: createMiddleware');
    const {
      record: { serialNumber, balance },
    } = args;
    new AccountMovementRepository().insert({
      serialNumber,
      value: balance,
      type: typeMovement.CREDIT,
    });
    return resolve(source, args, context, info);
  }

  async insert(payload) {
    await this.accountMovementRepository.insert(payload);
  }
}
export default AccountMovementService;
