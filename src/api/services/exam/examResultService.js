/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import AccountService from '../account/accountService.js';
import ExamResultRepository from '../../repositories/exam/examResultRepository.js';
import { typeMovement } from '../../models/accountMovement.js';
import PublishService from '../cubescan/publishService.js';
import AccountMovementService from '../account/accountMovementService.js';

class ExamResultService {
  constructor() {
    this.examResultRepository = new ExamResultRepository();
    this.accountService = new AccountService();
    this.publishService = new PublishService();
    this.accountMovementService = new AccountMovementService();
  }

  async insertMany(serialNumber, payload) {
    logger.info('ExamResultService: insertMany');
    let countInsert = 0;
    if (payload && payload.length > 0) {
      const promiseFind = [];
      payload.forEach((element) => {
        const { examNumber } = element;
        promiseFind.push(this.findOneBy({ examNumber }));
      });

      const exams = await Promise.all(promiseFind);

      const promiseInsert = [];
      exams.forEach((exam, index) => {
        if (!exam) {
          const element = payload[index];
          countInsert += 1;
          promiseInsert.push(this.examResultRepository.insert({ serialNumber, ...element }));
        }
      });

      await Promise.all(promiseInsert);
    }
    return countInsert;
  }

  async findOneBy(clauses) {
    const result = await this.examResultRepository.findOneBy(clauses);
    return result;
  }

  async saveExamsResult(payload) {
    logger.info('ExamResultService: saveExamsResult');
    const { serialNumber } = payload;
    const account = await this.accountService.findOneBy({ serialNumber });
    if (account) {
      const { results, topic } = payload;
      if (results && results.length > 0) {
        const inserted = await this.insertMany(serialNumber, results);

        account.balance -= inserted;
        if (account.balance < 0) {
          account.balance = 0;
        }

        if (inserted > 0) {
          await this.accountMovementService.insert({
            serialNumber,
            value: inserted,
            type: typeMovement.DEBIT,
          });

          await this.accountService.updateOne(account);
        }
        this.publishService.response(topic, { balance: account.balance });
      }
    }
  }
}
export default ExamResultService;
