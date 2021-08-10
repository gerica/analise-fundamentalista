/* eslint-disable no-underscore-dangle */
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import { typeMovement } from '../models/accountMovement.js';
import { PapelTC } from '../models/papel.js';
import AccountMovementService from '../services/account/accountMovementService.js';

const PapelQuery = {
  papelById: PapelTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  papelOne: PapelTC.getResolver('findOne', [UtilCrypt.deletedMiddleware]),
  papelById: PapelTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
  papelByIds: PapelTC.getResolver('findByIds', [UtilCrypt.deletedMiddleware]),
  papelOne: PapelTC.getResolver('findOne', [UtilCrypt.deletedMiddleware]),
  papelMany: PapelTC.getResolver('findMany', [UtilCrypt.deletedMiddleware]),
  papelCount: PapelTC.getResolver('count', [UtilCrypt.deletedMiddleware]),
  papelConnection: PapelTC.getResolver('connection', [UtilCrypt.deletedMiddleware]),
  papelPagination: PapelTC.getResolver('pagination', [UtilCrypt.deletedMiddleware]),
};

const PapelMutation = {
  papelCreateOne: PapelTC.getResolver('createOne'),
  // papelCreateMany: PapelTC.getResolver('createMany'),
  papelUpdateById: PapelTC.getResolver('updateById'),
  papelUpdateOne: PapelTC.getResolver('updateOne'),
  // papelUpdateMany: PapelTC.getResolver('updateMany'),
  // papelRemoveById: PapelTC.getResolver('removeById'),
  // papelRemoveOne: PapelTC.getResolver('removeOne'),
  // papelRemoveMany: PapelTC.getResolver('removeMany'),
};

export { PapelQuery, PapelMutation };
