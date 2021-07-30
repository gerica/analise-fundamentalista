import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import { importSchema } from 'graphql-import';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import config from './config/config.js';
import logger from './utils/logger.js';
import resolvers from './graphql/resolvers/index.js';
import UtilCrypt from './utils/crypt.js';
import database from './config/database.js';
import schemaComposer from './api/schema/index.js';
import SubscribeService from './api/services/cubescan/subscribeService.js';

const { PORT, PATH_GRAPHQL } = config;
const typeDefs = gql(importSchema('**/*.gql'));

const composer = schemaComposer.toSDL({ exclude: ['Boolean', 'String', 'Int'] });
const resolveMethods = schemaComposer.getResolveMethods();

const typesMerge = mergeTypeDefs([gql(composer), typeDefs]);
const resolversMerge = mergeResolvers([resolveMethods, resolvers]);

const schemaCompose = buildFederatedSchema([
  {
    typeDefs: typesMerge,
    resolvers: resolversMerge,
    //
  },
]);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema: schemaCompose,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const { payload: user, loggedIn } = UtilCrypt.getPayload(token);
    database.connect();
    return { user, loggedIn };
  },
  dataSources: () => ({}),
});

// The `listen` method launches a web server.
server.listen({ port: PORT, path: PATH_GRAPHQL }).then(({ url }) => {
  logger.info(url, 'Running a GraphQL API server at');
});

// Init services MQTT
const subscribeService = new SubscribeService();
subscribeService.receiveResult();
subscribeService.getBalance();
