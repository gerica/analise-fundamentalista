import { UserInputError } from 'apollo-server-errors';
import logger from '../../../utils/logger.js';
import { ExamResult } from '../../models/examResult.js';

class ExamResultRepository {
  async insert(payload) {
    logger.info('ExamResultRepository: insert');
    let result;
    try {
      result = new ExamResult({ ...payload });
      await result.save();
      logger.debug(`${result.id} documents were inserted with the _id: ${result.id}`);
    } catch (error) {
      return this.handleError(error);
    }
    return result;
  }

  async findOneBy(payload) {
    logger.info('ExamResultRepository: findOneBy');
    let result;
    try {
      const query = { ...payload, deleted: false };
      result = await ExamResult.findOne(query).exec();
      logger.debug(result);
    } catch (error) {
      this.handleError(error);
    }
    return result;
  }

  async findManyBy(payload, limit = 10, sort) {
    logger.info('ExamResultRepository: findManyBy');
    let result;
    try {
      const query = { ...payload, deleted: false };
      const mongoQuery = ExamResult.find(query);
      if (sort) {
        const listItems = [];
        Object.entries(sort).forEach((item) => {
          listItems.push(item);
        });
        mongoQuery.sort(listItems);
      }
      mongoQuery.limit(limit);
      result = await mongoQuery.exec();
      logger.debug(result);
    } catch (error) {
      this.handleError(error);
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(error) {
    logger.error(error);
    throw UserInputError(error);
  }
}

export default ExamResultRepository;
