import UtilCrypt from '../../../utils/crypt.js';
import { AccountTC } from '../../models/account.js';
import AccountMovementService from '../../services/account/accountMovementService.js';

const accountMovementService = new AccountMovementService();

const AccountQuery = {
  accountById: AccountTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  accountByIds: AccountTC.getResolver('findByIds', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountOne: AccountTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMany: AccountTC.getResolver('findMany', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountCount: AccountTC.getResolver('count', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountConnection: AccountTC.getResolver('connection', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountPagination: AccountTC.getResolver('pagination', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

const AccountMutation = {
  accountCreateOne: AccountTC.getResolver('createOne', [accountMovementService.createMiddleware]),
  // accountCreateMany: AccountTC.getResolver('createMany'),
  // accountUpdateById: AccountTC.getResolver('updateById', [UtilCrypt.authMiddleware]),
  // accountUpdateOne: AccountTC.getResolver('updateOne', [UtilCrypt.authMiddleware]),
  // accountUpdateMany: AccountTC.getResolver('updateMany', [UtilCrypt.authMiddleware]),`
  // accountRemoveById: AccountTC.getResolver('removeById'),
  // accountRemoveOne: AccountTC.getResolver('removeOne'),
  // accountRemoveMany: AccountTC.getResolver('removeMany'),
};

export { AccountQuery, AccountMutation };
