/* eslint-disable class-methods-use-this */
import logger from '../../../utils/logger.js';
import ExamResultRepository from '../../repositories/exam/examResultRepository.js';

class ExamResultService {
  constructor() {
    this.examResultRepository = new ExamResultRepository();
  }

  async insertMany(payload) {
    logger.info('ExamResultService: insertMany');
    if (payload && payload.length > 0) {
      payload.array.forEach(async (element) => {
        await this.examResultRepository.insert(element);
      });
    }
  }
}
export default ExamResultService;
