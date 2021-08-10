import { readFile } from 'fs/promises';
import logger from '../../utils/logger.js';
import PapelService from '../services/papelService.js';

let json;
async function loadInfo() {
  json = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url)));
}

const CommonQuery = {
  versionService: {
    type: 'String',
    resolve: async () => {
      logger.info('Get version');
      await loadInfo();
      const { name, version } = json;
      const result = `${name} - version:${version}`;
      return result;
    },
  },
};

const CommonMutation = {
  carga: {
    type: 'String',
    resolve: async () => {
      logger.info('Ralizar Carga');
      PapelService.realizarCarga();

      return 'sucesso';
    },
  },
};

export { CommonQuery, CommonMutation };
