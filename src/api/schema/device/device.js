import UtilCrypt from '../../../utils/crypt.js';
import logger from '../../../utils/logger.js';
import { DeviceTC } from '../../models/device.js';

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

    await DeviceTC.getResolver('updateById').resolve({
      context,
      info,
      args: {
        _id,
        record: {
          ...device.toObject(),
        },
      },
    });
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
