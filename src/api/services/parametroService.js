/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import { schemaComposer } from 'graphql-compose';
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import { ParametroTC } from '../models/parametro.js';

export const FUNDAMENTOS = {
  cotacao: 'Cotação',
  pl: 'P/L',
  pl_min: 'P/L min',
  pl_max: 'P/L max',
  p_vp: 'P/VP',
  p_vp_min: 'P/VP min',
  p_vp_max: 'P/VP max',
  psr: 'PSR',
  div_yield: 'Div.Yield',
  p_ativo: 'P/Ativo',
  p_cap_giro: 'P/Cap.Giro',
  p_ebit: 'P / EBIT',
  p_ativ_circ_liq: 'P/Ativ Circ.Liq',
  ev_ebit: 'EV/EBIT',
  ev_ebitda: 'EV/EBITDA',
  mrg_ebit: 'Mrg Ebit',
  mrg_liq: 'Mrg. Líq.',
  liq_corr: 'Liq. Corr.',
  roic: 'ROIC',
  roe: 'ROE',
  liq_2_meses: 'Liq.2meses',
  patrim_liq: 'Patrim. Líq',
  div_brut: 'Dív.Brut/ Patrim.',
  cresc_rec_5a: 'Cresc. Rec.5a',
};

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

    result.push({ descricao: FUNDAMENTOS.cotacao, ativo: false, valorRef: 0, maiorMelhor: false });
    result.push({ descricao: FUNDAMENTOS.pl_min, ativo: true, valorRef: 1, maiorMelhor: false });
    result.push({ descricao: FUNDAMENTOS.pl_max, ativo: true, valorRef: 30, maiorMelhor: false });
    result.push({ descricao: FUNDAMENTOS.p_vp_min, ativo: true, valorRef: 0, maiorMelhor: false });
    result.push({ descricao: FUNDAMENTOS.p_vp_max, ativo: true, valorRef: 20, maiorMelhor: false });
    result.push({ descricao: FUNDAMENTOS.psr, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.div_yield, ativo: true, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.p_ativo, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.p_cap_giro, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.p_ebit, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.p_ativ_circ_liq, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.ev_ebit, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.ev_ebitda, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.mrg_ebit, ativo: true, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.mrg_liq, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.liq_corr, ativo: true, valorRef: 1, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.roic, ativo: true, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.roe, ativo: true, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.liq_2_meses, ativo: true, valorRef: 100000, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.patrim_liq, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.div_brut, ativo: false, valorRef: 0, maiorMelhor: true });
    result.push({ descricao: FUNDAMENTOS.cresc_rec_5a, ativo: false, valorRef: 0, maiorMelhor: true });
    return result;
  }

  async getParametrosAtivos({ source, context, info }) {
    const args = {
      filter: {
        ativo: true,
      },
    };
    return this.query.parametroMany.resolve({
      source,
      args,
      context,
      info,
    });
  }
}

export default ParametroService;
