/* eslint-disable class-methods-use-this */
import { schemaComposer } from 'graphql-compose';
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import { ParametroTC } from '../models/parametro.js';

class ParametroService {
  constructor() {
    this.initQuery();
    this.initMutation();
  }

  initQuery() {
    this.query = {
      parametroOne: ParametroTC.getResolver('findOne', [UtilCrypt.deletedMiddleware]),
      parametroById: ParametroTC.getResolver('findById', [UtilCrypt.deletedMiddleware]),
      parametroByIds: ParametroTC.getResolver('findByIds', [UtilCrypt.deletedMiddleware]),
      parametroMany: ParametroTC.getResolver('findMany', [UtilCrypt.deletedMiddleware]),
      parametroCount: ParametroTC.getResolver('count', [UtilCrypt.deletedMiddleware]),
      parametroConnection: ParametroTC.getResolver('connection', [UtilCrypt.deletedMiddleware]),
      parametroPagination: ParametroTC.getResolver('pagination', [UtilCrypt.deletedMiddleware]),
    };
  }

  initMutation() {
    this.mutation = {
      parametroCreateOne: ParametroTC.getResolver('createOne'),
      parametroCreateMany: ParametroTC.getResolver('createMany'),
      parametroUpdateById: ParametroTC.getResolver('updateById'),
      parametroUpdateOne: ParametroTC.getResolver('updateOne'),
      parametroUpdateMany: ParametroTC.getResolver('updateMany'),
      parametroRemoveById: ParametroTC.getResolver('removeById'),
      parametroRemoveOne: ParametroTC.getResolver('removeOne'),
      parametroRemoveMany: ParametroTC.getResolver('removeMany'),
      parametroInit: this.getParametroInit(),
    };
  }

  getParametroInit() {
    logger.info('ParametroService: getParametroInit');

    // const parametroAnalizarTC = schemaComposer.createObjectTC({
    //   name: 'parametroAnalizarTC',
    //   fields: {
    //     papeis: {
    //       type: () => ParametroTC,
    //     },
    //   },
    // });
    return schemaComposer.createResolver({
      kink: 'query',
      name: 'parametroAnalisar',
      type: 'String',
      resolve: async ({ source, context, info }) => {
        logger.info('Resolve parametro init');
        await this.mutation.parametroCreateMany.resolve({
          source,
          context,
          info,
          args: {
            records: this.getParametroInitValues(),
          },
        });
        return 'sucesso';
      },
    });
  }

  getParametroInitValues() {
    const result = [];

    result.push({ descricao: 'Cotação', ativo: false, valorRef: 0 });
    result.push({ descricao: 'P/L min', ativo: true, valorRef: 1 });
    result.push({ descricao: 'P/L max', ativo: true, valorRef: 30 });
    result.push({ descricao: 'P/VP min', ativo: true, valorRef: 0 });
    result.push({ descricao: 'P/VP max', ativo: true, valorRef: 20 });
    result.push({ descricao: 'PSR', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Div.Yield', ativo: true, valorRef: 0 });
    result.push({ descricao: 'P/Ativo', ativo: false, valorRef: 0 });
    result.push({ descricao: 'P/Cap.Giro', ativo: false, valorRef: 0 });
    result.push({ descricao: 'P / EBIT', ativo: false, valorRef: 0 });
    result.push({ descricao: 'P/Ativ', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Circ.Liq', ativo: false, valorRef: 0 });
    result.push({ descricao: 'EV/EBIT', ativo: false, valorRef: 0 });
    result.push({ descricao: 'EV/EBITDA', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Mrg Ebit', ativo: true, valorRef: 0 });
    result.push({ descricao: 'Mrg. Líq.', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Liq. Corr.', ativo: true, valorRef: 1 });
    result.push({ descricao: 'ROIC', ativo: true, valorRef: 0 });
    result.push({ descricao: 'ROE', ativo: true, valorRef: 0 });
    result.push({ descricao: 'Liq.2meses', ativo: true, valorRef: 100000 });
    result.push({ descricao: 'Patrim. Líq', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Dív.Brut/ Patrim.', ativo: false, valorRef: 0 });
    result.push({ descricao: 'Cresc. Rec.5a', ativo: false, valorRef: 0 });
    return result;
  }
}

export default ParametroService;
