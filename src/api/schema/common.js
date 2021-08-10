import { readFile } from 'fs/promises';
import logger from '../../utils/logger.js';

let json;
async function loadInfo() {
  json = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url)));
}

const CommonQuery = {
  versionDeviceService: {
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

const CommonMutation = {};

export { CommonQuery, CommonMutation };
