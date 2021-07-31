import logger from './utils/logger.js';
import Database from './config/database.js';
import SubscribeService from './api/services/cubescan/subscribeService.js';
import ServerGraphql from './api/services/graphql/serverGraphql.js';

class Server {
  constructor() {
    this.serverGraphql = new ServerGraphql();
    this.subscribeService = new SubscribeService();
    this.database = new Database();
  }

  async init() {
    logger.info('🚀 Init credit service');
    await this.initDatabase();
    await this.initGraphQl();
    await this.initSubscribe();
  }

  async initDatabase() {
    await this.database.connect();
  }

  async initGraphQl() {
    this.serverGraphql.initServer();
  }

  async initSubscribe() {
    this.subscribeService.receiveResult();
    this.subscribeService.getBalance();
  }
}

new Server().init();
