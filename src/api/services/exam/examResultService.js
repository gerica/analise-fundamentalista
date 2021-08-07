/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import PublishService from '../cubescan/publishService.js';
import AccountMovementService from '../account/accountMovementService.js';
import DeviceService from '../device/deviceService.js';
import { ExamResultMutation, ExamResultQuery } from '../../schema/exam/examResult.js';

class ExamResultService {
  constructor() {
    this.deviceService = new DeviceService();
    this.accountMovementService = new AccountMovementService();
    this.publishService = new PublishService();
    this.query = ExamResultQuery;
    this.mutation = ExamResultMutation;
  }

  async insertMany(device, payload) {
    logger.info('ExamResultService: insertMany');
    let countInsert = 0;
    if (payload && payload.length > 0) {
      const { _id } = device;
      const promiseFind = [];
      payload.forEach((element) => {
        const { examNumber } = element;
        promiseFind.push(this.findOne({ examNumber }));
      });

      const exams = await Promise.all(promiseFind);

      const promiseInsert = [];
      exams.forEach((exam, index) => {
        if (!exam) {
          const element = payload[index];
          countInsert += 1;
          promiseInsert.push(
            this.mutation.examResultCreateOne.resolve({
              args: {
                record: {
                  device: _id,
                  ...element,
                },
              },
            }),
          );
        }
      });

      await Promise.all(promiseInsert);
    }
    return countInsert;
  }

  async findOne(clauses) {
    const result = await this.query.examResultOne.resolve({
      args: {
        filter: clauses,
      },
    });
    return result;
  }

  async saveExamsResult(payload) {
    logger.info('ExamResultService: saveExamsResult');
    const { serialNumber } = payload;
    const device = await this.deviceService.findOne({ serialNumber });

    if (device) {
      const { results, topic } = payload;
      if (results && results.length > 0) {
        const inserted = await this.insertMany(device, results);
        const { account } = device;

        account.balance -= inserted;
        if (account.balance < 0) {
          account.balance = 0;
        }

        if (inserted > 0) {
          const { _id } = account;
          const promises = [];
          promises.push(this.accountMovementService.createOne(_id, inserted));
          device.account = account;
          promises.push(this.deviceService.updateOne(device.toObject()));
          await Promise.all(promises);
        }
        this.publishService.response(topic, { balance: account.balance });
      }
    }
  }
}
export default ExamResultService;
