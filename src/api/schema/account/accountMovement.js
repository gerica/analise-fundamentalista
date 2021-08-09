/* eslint-disable max-len */
// import { schemaComposer, toInputObjectType } from 'graphql-compose';
import UtilCrypt from '../../../utils/crypt.js';
import logger from '../../../utils/logger.js';
import { AccountMovementTC } from '../../models/accountMovement.js';
import { DeviceTC } from '../../models/device.js';

// const OrderETC = schemaComposer.createEnumTC({
//   name: 'StatusEnum',
//   values: {
//     VALUE_ASC: { value: 1 },
//     VALUE_DESC: { value: -1 },
//     TYPE_ASC: { value: 1 },
//     TYPE_DESC: { value: -1 },
//   },
// });

// const FindBySerialNumberSortTC = schemaComposer.createObjectTC({
//   name: 'FindBySerialNumberSort',
//   fields: {
//     sort: AccountMovementTC.getResolver('findMany').args.sort,
//   },
// });

// const FindBySerialNumberSortITC = toInputObjectType(FindBySerialNumberSortTC);

AccountMovementTC.addResolver({
  kind: 'query',
  name: 'findBySerialNumber',
  args: {
    serialNumber: 'String',
    limit: 'Int',
    sort: AccountMovementTC.getResolver('findMany').args.sort,
    //   filter: `input CityFilterInput {
    //   code: String!
    // }`,
  },
  // args: { serialNumber: 'String', limit: 'Int', sort: InputITC },
  type: [AccountMovementTC],
  resolve: async ({ args }, context, info) => {
    logger.info('AccountMovementTC: findBySerialNumber');
    const { serialNumber, limit, sort } = args;
    logger.info(sort);
    const device = await DeviceTC.getResolver('findOne').resolve({
      args: { filter: { serialNumber } },
      context,
      info,
    });
    if (device) {
      const { account } = device;
      if (account) {
        const { _id } = account;
        const result = await AccountMovementTC.getResolver('findMany').resolve({
          args: {
            filter: {
              account: _id,
            },
            limit,
            sort,
          },
          context,
          info,
        });
        return result;
      }
    }
    return null;
  },
});

const AccountMovementQuery = {
  accountMovementById: AccountMovementTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  accountMovementByIds: AccountMovementTC.getResolver('findByIds', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementBySN: AccountMovementTC.getResolver('findBySerialNumber', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementOne: AccountMovementTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementMany: AccountMovementTC.getResolver('findMany', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementCount: AccountMovementTC.getResolver('count', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementConnection: AccountMovementTC.getResolver('connection', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  accountMovementPagination: AccountMovementTC.getResolver('pagination', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

const AccountMovementMutation = {
  accountMovementCreateOne: AccountMovementTC.getResolver('createOne', [UtilCrypt.authMiddleware]),
  // accountMovementCreateMany: AccountMovementTC.getResolver('createMany'),
  accountMovementUpdateById: AccountMovementTC.getResolver('updateById', [UtilCrypt.authMiddleware]),
  accountMovementUpdateOne: AccountMovementTC.getResolver('updateOne', [UtilCrypt.authMiddleware]),
  accountMovementUpdateMany: AccountMovementTC.getResolver('updateMany', [UtilCrypt.authMiddleware]),
  // accountMovementRemoveById: AccountMovementTC.getResolver('removeById'),
  // accountMovementRemoveOne: AccountMovementTC.getResolver('removeOne'),
  // accountMovementRemoveMany: AccountMovementTC.getResolver('removeMany'),
};

export { AccountMovementQuery, AccountMovementMutation };
