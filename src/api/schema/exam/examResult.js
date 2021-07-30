import UtilCrypt from '../../../utils/crypt.js';
import { ExamResultTC } from '../../models/examResult.js';

const ExamResultQuery = {
  examResultById: ExamResultTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  examResultByIds: ExamResultTC.getResolver('findByIds', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  examResultOne: ExamResultTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  examResultMany: ExamResultTC.getResolver('findMany', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  examResultCount: ExamResultTC.getResolver('count', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  examResultConnection: ExamResultTC.getResolver('connection', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
  examResultPagination: ExamResultTC.getResolver('pagination', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
};

const ExamResultMutation = {};

export { ExamResultQuery, ExamResultMutation };
