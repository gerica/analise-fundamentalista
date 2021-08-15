/* eslint-disable class-methods-use-this */
import { readFile } from 'fs/promises';
import logger from '../../utils/logger.js';
import PapelService from './papelService.js';

let json;
async function loadInfo() {
  json = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url)));
}

class CommonService {
  constructor() {
    this.papelService = new PapelService();
    this.initQuery();
    this.initMutation();
  }

  initQuery() {
    this.query = {
      versionService: this.getVersion(),
    };
  }

  initMutation() {
    this.mutation = {
      carga: this.getCarga(),
    };
  }

  getVersion() {
    return {
      type: 'String',
      resolve: async () => {
        logger.info('Get version');
        await loadInfo();
        const { name, version } = json;
        const result = `${name} - version:${version}`;
        return result;
      },
    };
  }

  getCarga() {
    return {
      type: 'String',
      resolve: async () => {
        logger.info('Ralizar Carga');
        const result = await this.papelService.realizarCarga();
        return result;
      },
    };
  }
}

export default CommonService;
