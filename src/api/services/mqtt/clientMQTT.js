import logger from '../../../utils/logger.js';
import config from '../../../config/config.js';
import BaseMQTT from './baseMQTT.js';

const {
  MQ_TOPIC_CREDIT,
  MQ_TOPIC_CREDIT_BIND,
  MQ_TYPE_EXCHANGE,
  //
} = config;

class ClientMQTT extends BaseMQTT {
  async sendInfo() {
    logger.info('ReceiverMQTT: receiveCredit');
    try {
      const { channel } = await this.createConnection();

      const exchange = MQ_TOPIC_CREDIT;
      channel.assertExchange(exchange, MQ_TYPE_EXCHANGE, {
        durable: true,
      });

      const msg = 'Client test';
      channel.publish(exchange, MQ_TOPIC_CREDIT_BIND, Buffer.from(msg));
      logger.info(" [x] Sent %s:'%s'", MQ_TOPIC_CREDIT_BIND, msg);

      setTimeout(() => {
        this.closeConnection();
      }, 500);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

const server = new ClientMQTT();
server.sendInfo();

export default ClientMQTT;
