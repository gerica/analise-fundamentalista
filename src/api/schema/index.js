import { SchemaComposer } from 'graphql-compose';

import { AccountQuery, AccountMutation } from './account.js';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...AccountQuery,
});

schemaComposer.Mutation.addFields({
  ...AccountMutation,
});

// const graphqlSchema = schemaComposer.buildSchema();
export default schemaComposer;
