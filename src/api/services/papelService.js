/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import { schemaComposer } from 'graphql-compose';
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import { PapelTC } from '../models/papel.js';
import HtmlParseService from './htmlParseService.js';

class PapelService {
  constructor() {
    this.initQuery();
    this.initMutation();
  }

  initQuery() {
    this.query = {
      papelOne: PapelTC.getResolver('findOne', [UtilCrypt.deletedMiddleware]),
      papelById: PapelTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
      papelByIds: PapelTC.getResolver('findByIds', [UtilCrypt.deletedMiddleware]),
      papelMany: PapelTC.getResolver('findMany', [UtilCrypt.deletedMiddleware]),
      papelCount: PapelTC.getResolver('count', [UtilCrypt.deletedMiddleware]),
      papelConnection: PapelTC.getResolver('connection', [UtilCrypt.deletedMiddleware]),
      papelPagination: PapelTC.getResolver('pagination', [UtilCrypt.deletedMiddleware]),
      papelAnalizar: this.getPapelAnalisar(),
    };
  }

  initMutation() {
    this.mutation = {
      papelCreateOne: PapelTC.getResolver('createOne'),
      papelCreateMany: PapelTC.getResolver('createMany'),
      papelUpdateById: PapelTC.getResolver('updateById'),
      papelUpdateOne: PapelTC.getResolver('updateOne'),
      // papelUpdateMany: PapelTC.getResolver('updateMany'),
      // papelRemoveById: PapelTC.getResolver('removeById'),
      // papelRemoveOne: PapelTC.getResolver('removeOne'),
      // papelRemoveMany: PapelTC.getResolver('removeMany'),
    };
  }

  async realizarCarga() {
    logger.info('PapelService: realizarCarga');
    const papeis = await HtmlParseService.parse();
    // logger.info(papeis);
    const createMany = PapelTC.getResolver('createMany');

    createMany.resolve({
      args: {
        records: papeis,
      },
    });
  }

  getPapelAnalisar() {
    logger.info('PapelService: getPapelAnalisar');
    PapelTC.addFields({
      rank: 'Int',
    });
    // const PapelAnalizarTC = schemaComposer.createObjectTC({
    //   name: 'PapelAnalizarTC',
    //   fields: {
    //     papeis: {
    //       type: () => PapelTC,
    //     },
    //   },
    // });
    return schemaComposer.createResolver({
      kink: 'query',
      name: 'papelAnalisar',
      type: [PapelTC],
      resolve: async ({ source, args, context, info }) => {
        logger.info('Resolve papel analizar');
        const result = await this.query.papelMany.resolve({ source, args, context, info });
        return result;
      },
    });
  }
}

export default PapelService;
