import logger from '../../../utils/logger.js';
import config from '../../../config/config.js';
import BaseMQTT from './baseMQTT.js';
// import { AccountTC } from '../../models/account.js';
// import AccountMovementService from '../account/accountMovemintService.js';
import AccountService from '../account/accountService.js';
import database from '../../../config/database.js';

const {
  MQ_TOPIC_CREDIT,
  MQ_TOPIC_CREDIT_BIND,
  MQ_TYPE_EXCHANGE,
  //
} = config;

class ReceiverMQTT extends BaseMQTT {
  async receiveCredit() {
    logger.info('ReceiverMQTT: receiveCredit');
    try {
      const { channel } = await this.createConnection();

      const exchange = MQ_TOPIC_CREDIT;

      channel.assertExchange(exchange, MQ_TYPE_EXCHANGE, {
        durable: true,
      });

      const processMessage = async (message) => {
        logger.info("[x] %s:'%s'", message.fields.routingKey, message.content.toString());
        const payload = this.extractResult(message);
        await database.connect();
        AccountService.updateCredit(payload);
        // eslint-disable-next-line max-len
        // const createAccount = AccountTC.getResolver('createOne', [AccountMovementService.createMiddleware]);

        // createAccount.resolve({
        //   source: {},
        //   args: payload,
        //   context: {},
        //   info: {},
        // });
      };

      const assertQueue = channel.assertQueue('', {
        exclusive: true,
      });

      logger.info(`[*] MQ: waiting message for ${MQ_TOPIC_CREDIT} and bind ${MQ_TOPIC_CREDIT_BIND}.`);

      channel.bindQueue(assertQueue.queue, exchange, MQ_TOPIC_CREDIT_BIND);

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

export default ReceiverMQTT;
