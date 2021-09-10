import Cheerio from 'cheerio';
import got from 'got';
// import jsdom from 'jsdom';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';
import StringUtils from '../../utils/stringUtils.js';
import { FUNDAMENTOS } from './parametroService.js';

// const { JSDOM } = jsdom;
class HtmlParseService {
  static async parse() {
    logger.info('HtmlParceService: parce');
    const { URL_PAPEIS_PARSE } = config;
    const papeis = [];
    const response = await got(URL_PAPEIS_PARSE);

    const $ = Cheerio.load(response.body);
    $('table').each((index, table) => {
      $(table)
        .find('tbody')
        .each((index2, tbody) => {
          $(tbody)
            .find('tr')
            .each((index3, tr) => {
              //   const resPapel = $(tr).find('span').text();
              //   logger.info(resPapel);
              const tds = $(tr).text().split('\n');
              const namePapel = tds[1];
              const papel = { nome: namePapel, papel: namePapel };
              const fundamentos = [];
              fundamentos.push({
                descricao: FUNDAMENTOS.cotacao,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[2], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.pl,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[3], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.p_vp,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[4], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.psr,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[5], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.div_yield,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[6], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.p_ativo,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[7], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.p_cap_giro,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[8], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.p_ebit,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[9], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.p_ativ_circ_liq,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[10], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.ev_ebit,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[11], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.ev_ebitda,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[12], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.mrg_ebit,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[13], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.mrg_liq,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[14], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.liq_corr,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[15], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.roic,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[16], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.roe,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[17], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.liq_2_meses,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[18], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.patrim_liq,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[19], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.div_brut,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[20], '%')),
              });
              fundamentos.push({
                descricao: FUNDAMENTOS.cresc_rec_5a,
                valor: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[21], '%')),
              });

              papel.fundamentos = fundamentos;
              papeis.push(papel);
              //   console.log($(tr).text());
            });
        });
    });

    return papeis;
  }
}
export default HtmlParseService;
