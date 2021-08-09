/* eslint-disable no-underscore-dangle */
import UtilCrypt from '../../../utils/crypt.js';
import logger from '../../../utils/logger.js';
import { typeMovement } from '../../models/accountMovement.js';
import { DeviceTC } from '../../models/device.js';
import AccountMovementService from '../../services/account/accountMovementService.js';

const accountMovementService = new AccountMovementService();

DeviceTC.addResolver({
  kind: 'mutation',
  name: 'deviceAddCreditById',
  args: { _id: 'String', value: 'Int' },
  type: DeviceTC,
  resolve: async ({ args, context, info }) => {
    logger.info('deviceAddCreditById');
    const { _id, value } = args;
    const device = await DeviceTC.getResolver('findById').resolve({ args: { _id }, context, info });
    const { account } = device;
    account.balance += value;
    device.account = account;

    const promises = [];
    const type = value > 0 ? typeMovement.CREDIT : typeMovement.DEBIT;
    promises.push(accountMovementService.createOne(account._id, value, type));

    promises.push(
      DeviceTC.getResolver('updateById').resolve({
        context,
        info,
        args: {
          _id,
          record: {
            ...device.toObject(),
          },
        },
      }),
    );
    await Promise.all(promises);
    return device;
  },
});

const DeviceQuery = {
  deviceById: DeviceTC.getResolver('findById', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  deviceOne: DeviceTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

const DeviceMutation = {
  deviceUpdateById: DeviceTC.getResolver('updateById'),
};

const DeviceMutationExport = {
  deviceAddCreditById: DeviceTC.getResolver('deviceAddCreditById', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

export { DeviceQuery, DeviceMutation, DeviceMutationExport };
