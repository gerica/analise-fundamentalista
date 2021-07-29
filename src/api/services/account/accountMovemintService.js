/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import AccountMovementRepository from '../../repositories/accountMovemintRepository.js';

class AccountMovementService {
  static async createMiddleware(resolve, source, args, context, info) {
    logger.info('AccountMovementService: createMiddleware');
    const {
      record: { serialNumber, balance },
    } = args;
    AccountMovementRepository.insert({ serialNumber, value: balance });
    return resolve(source, args, context, info);
  }
}
export default AccountMovementService;
