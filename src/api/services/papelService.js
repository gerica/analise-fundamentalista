import logger from '../../utils/logger.js';
import { PapelTC } from '../models/papel.js';
import HtmlParseService from './htmlParseService.js';

class PapelService {
  static async realizarCarga() {
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
}

export default PapelService;
