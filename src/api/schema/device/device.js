import UtilCrypt from '../../../utils/crypt.js';
import { DeviceTC } from '../../models/device.js';

const DeviceQuery = {
  deviceOne: DeviceTC.getResolver('findOne', [UtilCrypt.deletedMiddleware]),
};

const DeviceMutation = {
  deviceUpdateById: DeviceTC.getResolver('updateById'),
};

export { DeviceQuery, DeviceMutation };
