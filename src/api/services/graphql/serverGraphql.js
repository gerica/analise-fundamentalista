/* eslint-disable class-methods-use-this */
import { ApolloServer } from 'apollo-server';
import graphqlSchema from '../../schema/index.js';
import config from '../../../config/config.js';
import UtilCrypt from '../../../utils/crypt.js';
import logger from '../../../utils/logger.js';

class ServerGraphql {
  initServer() {
    const { PORT, PATH_GRAPHQL } = config;

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
      schema: graphqlSchema,
      context: ({ req }) => {
        const token = req.headers.authorization || '';
        const { payload: user, loggedIn } = UtilCrypt.getPayload(token);
        return { user, loggedIn };
      },
      dataSources: () => ({}),
      introspection: true,
    });

    // The `listen` method launches a web server.
    server.listen({ port: PORT, path: PATH_GRAPHQL }).then(({ url }) => {
      logger.info(`${url} - %s`, 'Running a GraphQL API server');
    });
  }
}

export default ServerGraphql;
