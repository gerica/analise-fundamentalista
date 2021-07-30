import UtilCrypt from '../../../utils/crypt.js';
import { AccountMovementTC } from '../../models/accountMovement.js';

const AccountMovementQuery = {
  accountMovementById: AccountMovementTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  accountMovementByIds: AccountMovementTC.getResolver('findByIds', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementOne: AccountMovementTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementMany: AccountMovementTC.getResolver('findMany', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementCount: AccountMovementTC.getResolver('count', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementConnection: AccountMovementTC.getResolver('connection', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementPagination: AccountMovementTC.getResolver('pagination', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

const AccountMovementMutation = {
  accountMovementCreateOne: AccountMovementTC.getResolver('createOne'),
  // accountMovementCreateMany: AccountMovementTC.getResolver('createMany'),
  accountMovementUpdateById: AccountMovementTC.getResolver('updateById', [UtilCrypt.authMiddleware]),
  accountMovementUpdateOne: AccountMovementTC.getResolver('updateOne', [UtilCrypt.authMiddleware]),
  accountMovementUpdateMany: AccountMovementTC.getResolver('updateMany', [UtilCrypt.authMiddleware]),
  // accountMovementRemoveById: AccountMovementTC.getResolver('removeById'),
  // accountMovementRemoveOne: AccountMovementTC.getResolver('removeOne'),
  // accountMovementRemoveMany: AccountMovementTC.getResolver('removeMany'),
};

export { AccountMovementQuery, AccountMovementMutation };
