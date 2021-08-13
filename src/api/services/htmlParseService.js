import Cheerio from 'cheerio';
import got from 'got';
// import jsdom from 'jsdom';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';
import StringUtils from '../../utils/stringUtils.js';

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
              const fundamento = {
                p_l: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[3], '%')),
                p_vp: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[4], '%')),
                dividentoYIELD: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[6], '%')),
                margemEBIT: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[13], '%')),
                liquidezCorrete: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[15], '%')),
                roe: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[17], '%')),
                liquidez2Meses: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[18], '%')),
                crescimento: StringUtils.convertToCurrency(StringUtils.removeCharacters(tds[21], '%')),
              };
              papel.fundamento = fundamento;
              papeis.push(papel);
              //   console.log($(tr).text());
            });
        });
    });

    return papeis;
  }
}
export default HtmlParseService;
