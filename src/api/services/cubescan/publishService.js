import logger from '../../../utils/logger.js';
import config from '../../../config/config.js';
import BaseMQTT from './baseMQTT.js';
import StringUtils from '../../../utils/stringUtils.js';

const {
  MQ_TOPIC_CREDIT,
  MQ_TYPE_EXCHANGE,
  //
} = config;

class PublishService extends BaseMQTT {
  async response(to, payload) {
    if (!to) {
      return;
    }
    logger.info('PublishService: response');

    try {
      const { channel } = await this.createConnection();

      const exchange = MQ_TOPIC_CREDIT;
      channel.assertExchange(exchange, MQ_TYPE_EXCHANGE, {
        durable: true,
      });

      const body = JSON.stringify(payload);
      const topic = StringUtils.configureTopic(to);
      channel.publish(exchange, topic, Buffer.from(body));
      logger.info("[x] Sent %s:'%s'", topic, body);

      setTimeout(() => {
        this.closeConnection();
      }, 500);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

// const obj = new PublishService();
// obj.response('radiolife.result.response.1', { msg: 'teste' });
// setTimeout(() => {
//   process.exit();
// }, 2000);

export default PublishService;
