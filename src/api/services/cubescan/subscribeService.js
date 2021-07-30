import logger from '../../../utils/logger.js';
import config from '../../../config/config.js';
import BaseMQTT from './baseMQTT.js';
import AccountService from '../account/accountService.js';
import database from '../../../config/database.js';

const {
  MQ_TOPIC_CREDIT,
  MQ_TYPE_EXCHANGE,
  MQ_TOPIC_RESULT_BIND,
  MQ_TOPIC_BALANCE_BIND,
  //
} = config;

class SubscribeService extends BaseMQTT {
  constructor() {
    super();
    this.accountService = new AccountService();
  }

  async receiveResult() {
    logger.info('SubscribeService: receiveResult');

    try {
      const { channel } = await this.createConnection();

      const exchange = MQ_TOPIC_CREDIT;

      channel.assertExchange(exchange, MQ_TYPE_EXCHANGE, {
        durable: true,
      });

      const processMessage = async (message) => {
        logger.info('[x] receive message');
        logger.debug("[x] %s:'%s'", message.fields.routingKey, message.content.toString());
        const payload = this.extractResult(message);

        await database.connect();
        await this.accountService.updateCredit(payload);
        await database.disconnect();
      };

      const assertQueue = channel.assertQueue('', {
        exclusive: true,
      });

      logger.info(`[*] MQ: waiting message for ${MQ_TOPIC_CREDIT} and bind ${MQ_TOPIC_RESULT_BIND}`);

      channel.bindQueue(assertQueue.queue, exchange, MQ_TOPIC_RESULT_BIND);

      channel.consume(assertQueue.queue, processMessage, {
        noAck: true,
      });
      // },
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getBalance() {
    logger.info('SubscribeService: getBalance');

    try {
      const { channel } = await this.createConnection();

      const exchange = MQ_TOPIC_CREDIT;

      channel.assertExchange(exchange, MQ_TYPE_EXCHANGE, {
        durable: true,
      });

      const processMessage = async (message) => {
        logger.info('[x] receive message');
        logger.debug("[x] %s:'%s'", message.fields.routingKey, message.content.toString());
        const payload = this.extractResult(message);

        await database.connect();
        await this.accountService.getBalance(payload);
        await database.disconnect();
      };

      const assertQueue = channel.assertQueue('', {
        exclusive: true,
      });

      logger.info(`[*] MQ: waiting message for ${MQ_TOPIC_CREDIT} and bind ${MQ_TOPIC_BALANCE_BIND}`);

      channel.bindQueue(assertQueue.queue, exchange, MQ_TOPIC_BALANCE_BIND);

      channel.consume(assertQueue.queue, processMessage, {
        noAck: true,
      });
      // },
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

export default SubscribeService;

// eslint-disable-next-line max-len
// const createAccount = AccountTC.getResolver('createOne', [AccountMovementService.createMiddleware]);
// createAccount.resolve({
//   source: {},
//   args: payload,
//   context: {},
//   info: {},
// });
