/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { DeviceMutation, DeviceQuery } from '../../schema/device/device.js';
import PublishService from '../cubescan/publishService.js';

class DeviceService {
  constructor() {
    this.query = DeviceQuery;
    this.mutation = DeviceMutation;
    this.publishService = new PublishService();
  }

  async findOne(payload) {
    logger.info('DeviceService: findOne');
    const device = await this.query.deviceOne.resolve({
      args: {
        filter: payload,
      },
    });
    return device;
  }

  async updateOne({ args }) {
    logger.info('DeviceService: updateOne');
    const { _id } = args;
    return this.mutation.deviceUpdateById.resolve({
      args: {
        _id,
        record: {
          ...args,
        },
      },
    });
  }

  async getBalance(payload) {
    logger.info('DeviceService: getBalance');
    const { serialNumber } = payload;
    const device = await this.findOne({ serialNumber });
    if (device) {
      const { account } = device;
      const { topic } = payload;
      this.publishService.response(topic, { balance: account.balance });
    }
  }

  handleError(error) {
    throw new UserInputError(error);
  }
}
export default DeviceService;
