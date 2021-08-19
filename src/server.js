import logger from './utils/logger.js';
import Database from './config/database.js';
import ServerGraphql from './api/services/graphql/serverGraphql.js';

class Server {
  constructor() {
    this.serverGraphql = new ServerGraphql();
    this.database = new Database();
  }

  async init() {
    logger.info('🚀 Init fundamentalista-api service');
    await this.initDatabase();
    await this.initGraphQl();
  }

  async initDatabase() {
    await this.database.connect();
  }

  async initGraphQl() {
    this.serverGraphql.initServer();
  }
}

new Server().init();
