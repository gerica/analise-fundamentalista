/* eslint-disable class-methods-use-this */
import amqp from 'amqplib';
import logger from '../../../utils/logger.js';
import config from '../../../config/config.js';

const {
  MQ_HOST,
  MQ_USER,
  MQ_PASSWORD,
  //
} = config;

class BaseMQTT {
  async createConnection() {
    const urlMQ = `amqp://${MQ_USER}:${MQ_PASSWORD}@${MQ_HOST}`;
    logger.info(urlMQ);
    const connection = await amqp.connect(urlMQ);
    const channel = await connection.createChannel();
    return { connection, channel };
  }

  closeConnection(channel, connection) {
    setTimeout(() => {
      if (channel) {
        channel.close();
      }
      if (connection) {
        connection.close();
      }
    }, 500);
  }

  handleError(error) {
    logger.error(error);
  }

  extractResult(message) {
    try {
      const msgObj = JSON.parse(message.content.toString());
      logger.info(msgObj);
      return msgObj;
    } catch (error) {
      // this.handleError(error);
    }
    return null;
  }
}

export default BaseMQTT;
