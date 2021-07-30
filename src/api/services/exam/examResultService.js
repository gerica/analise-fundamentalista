/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import ExamResultRepository from '../../repositories/exam/examResultRepository.js';

class ExamResultService {
  constructor() {
    this.examResultRepository = new ExamResultRepository();
  }

  async insertMany(serialNumber, payload) {
    logger.info('ExamResultService: insertMany');
    if (payload && payload.length > 0) {
      payload.forEach(async (element) => {
        await this.examResultRepository.insert({ serialNumber, ...element });
      });
    }
  }
}
export default ExamResultService;
