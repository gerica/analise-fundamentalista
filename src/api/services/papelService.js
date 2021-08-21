/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import { schemaComposer } from 'graphql-compose';
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import StringUtils from '../../utils/stringUtils.js';
import { PapelTC } from '../models/papel.js';
import HtmlParseService from './htmlParseService.js';
import ParametroService, { FUNDAMENTOS } from './parametroService.js';

class PapelService {
  constructor() {
    this.parametroService = new ParametroService();
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
    const papel = await this.query.papelOne.resolve({ args: { filter: { _operators: { createdAt: { gte: StringUtils.getDataInicioDia() } } } } });
    if (!papel) {
      const papeis = await HtmlParseService.parse();

      this.mutation.papelCreateMany.resolve({
        args: {
          records: papeis,
        },
      });
      return 'Carga em processamento.';
    }
    return 'A carga para hoje já foi realizada';
  }

  getPapelAnalisar() {
    logger.info('PapelService: getPapelAnalisar');
    PapelTC.addFields({
      rank: 'Int',
      pontos: 'Int',
    });

    return schemaComposer.createResolver({
      kink: 'query',
      name: 'papelAnalisar',
      args: { dataRef: 'Date' },
      type: [PapelTC],
      resolve: async (payload) => {
        logger.info('Resolve papel analizar');
        const result = await this.analizarPapelPorData(payload);
        return result;
      },
    });
  }

  async analizarPapelPorData(payload) {
    logger.info('PapelService: analizarPapelPorData');
    const { args } = payload;
    const { dataRef } = args;
    let dataPesquisa;
    if (dataRef) {
      dataPesquisa = dataRef;
    } else {
      dataPesquisa = new Date();
    }
    const newArgs = {};

    newArgs.filter = {
      AND: [
        { _operators: { createdAt: { gte: StringUtils.getDataInicioDia(dataPesquisa) } } },
        //
        { _operators: { createdAt: { lte: StringUtils.getDataFinalDiaDia(dataPesquisa) } } },
      ],
    };

    const papeis = await this.query.papelMany.resolve({
      ...payload,
      args: newArgs,
      // args: { limit: 430 },
      //
    });

    const parametros = await this.parametroService.getParametrosAtivos(payload);
    return this.analizarPaper(papeis, parametros);
  }

  analizarPaper(papeis, parametros) {
    logger.info('PapelService: analizarPaper');
    const result = [];
    if (papeis && papeis.length > 0) {
      const getParametro = (fundamento) => {
        let param;
        if (parametros && parametros.length > 0) {
          param = parametros.find((parametro) => parametro.descricao === fundamento.descricao);
        }
        return param;
      };

      papeis.forEach((papel) => {
        // logger.info(papel);
        const adicionar = papel.fundamentos.every((fundamento) => {
          if (fundamento.descricao === FUNDAMENTOS.pl) {
            const parametroMin = getParametro({ descricao: FUNDAMENTOS.pl_min });
            const parametroMax = getParametro({ descricao: FUNDAMENTOS.pl_max });
            // eslint-disable-next-line max-len
            if (parametroMin && parametroMax && (fundamento.valor < parametroMin.valorRef || fundamento.valor > parametroMax.valorRef)) {
              return false;
            }
            return true;
          }
          if (fundamento.descricao === FUNDAMENTOS.p_vp) {
            const parametroMin = getParametro({ descricao: FUNDAMENTOS.p_vp_min });
            const parametroMax = getParametro({ descricao: FUNDAMENTOS.p_vp_max });
            // eslint-disable-next-line max-len
            if (parametroMin && parametroMax && (fundamento.valor < parametroMin.valorRef || fundamento.valor > parametroMax.valorRef)) {
              return false;
            }
            return true;
          }
          const parametro = getParametro(fundamento);
          if (parametro && fundamento.valor < parametro.valorRef) {
            return false;
          }
          return true;
        });
        if (adicionar) {
          const newPapel = { ...papel.toObject(), rank: 0, pontos: 0 };
          result.push(newPapel);
        }
      });
    }
    logger.info(`Antes de analisar: ${papeis.length}`);
    logger.info(`Depois de analisar: ${result.length}`);
    this.calcularPontos(result, parametros);
    return result;
  }

  calcularPontos(lista, fundamentos) {
    logger.info('PapelService: calcularPontos');
    fundamentos.forEach((fundamento) => {
      let ordenar = true;
      if (FUNDAMENTOS.pl_min === fundamento.descricao) {
        fundamento.descricao = FUNDAMENTOS.pl;
      }
      if (FUNDAMENTOS.p_vp_min === fundamento.descricao) {
        fundamento.descricao = FUNDAMENTOS.p_vp;
      }

      if (FUNDAMENTOS.pl_max === fundamento.descricao || FUNDAMENTOS.p_vp_max === fundamento.descricao) {
        ordenar = false;
      }
      if (ordenar) {
        this.ordenar(lista, fundamento);
      }
      this.adicionarPontos(lista);
    });
    this.calcularRank(lista);
  }

  ordenar(lista, fundamento) {
    lista.sort((papelA, papelB) => {
      const fundA = papelA.fundamentos.find((f) => f.descricao === fundamento.descricao);
      const fundB = papelB.fundamentos.find((f) => f.descricao === fundamento.descricao);
      // Quanto menor melhor
      if (fundamento.maiorMelhor) {
        // Quanto maior melhor
        if (fundB.valor > fundA.valor) {
          return 1;
        }
        if (fundB.valor < fundA.valor) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }
      if (fundA.valor > fundB.valor) {
        return 1;
      }
      if (fundA.valor < fundB.valor) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  adicionarPontos(lista) {
    // logger.info('PapelService: adicionarPontos');
    lista.forEach((papel, index) => {
      // eslint-disable-next-line no-param-reassign
      papel.pontos += index;
    });
  }

  calcularRank(lista) {
    lista.sort((papelA, papelB) => {
      if (papelA.pontos > papelB.pontos) {
        return 1;
      }
      if (papelA.pontos < papelB.pontos) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    lista.forEach((papel, index) => {
      // eslint-disable-next-line no-param-reassign
      papel.rank = index + 1;
    });
  }
}

export default PapelService;

// const PapelAnalizarTC = schemaComposer.createObjectTC({
//   name: 'PapelAnalizarTC',
//   fields: {
//     papeis: {
//       type: () => PapelTC,
//     },
//   },
// });
