/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';

import config from './config.js';
import logger from '../utils/logger.js';

const {
  DATABASE_NAME,
  MONGO_CONNECTION,
  MONGO_USER,
  MONGO_PASSWORD,
  //
} = config;

class Database {
  handleError(error) {
    logger.error(error);
    return new SyntaxError(error);
  }

  async connect() {
    const uri = `${MONGO_CONNECTION}/${DATABASE_NAME}`;

    const options = {
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 50, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      // auth: { authSource: 'admin' },
      user: MONGO_USER,
      pass: MONGO_PASSWORD,
    };
    let connection;
    try {
      connection = await mongoose.connect(uri, options);
      mongoose.set('debug', 'true');
    } catch (error) {
      this.handleError(error);
    }
    logger.debug(`Connected in: ${uri}`);
    return connection;
  }

  async disconnect() {
    await mongoose.disconnect();
    // if (!client || !client.isConnected()) {
    //   return true;
    // }
    // await client.close();
    // client = null;
    return true;
  }
}
export default Database;
