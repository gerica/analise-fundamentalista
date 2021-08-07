/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import { AccountMovementMutation } from '../../schema/account/accountMovement.js';

class AccountMovementService {
  constructor() {
    this.mutation = AccountMovementMutation;
  }

  async createOne(idAccount, value) {
    logger.info('AccountMovementService: createOne');
    return this.mutation.accountMovementCreateOne.resolve({
      args: {
        record: {
          account: idAccount,
          value,
          type: typeMovement.DEBIT,
        },
      },
    });
  }

  // async insertByMiddleware(resolve, source, args, context, info) {
  //   logger.info('AccountMovementService: createMiddleware');
  //   const {
  //     record: { serialNumber, balance },
  //   } = args;
  //   new AccountMovementRepository().insert({
  //     serialNumber,
  //     value: balance,
  //     type: typeMovement.CREDIT,
  //   });
  //   return resolve(source, args, context, info);
  // }

  async insert(payload) {
    await this.accountMovementRepository.insert(payload);
  }
}
export default AccountMovementService;
