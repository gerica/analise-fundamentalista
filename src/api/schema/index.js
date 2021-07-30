import { SchemaComposer } from 'graphql-compose';

import { AccountQuery, AccountMutation } from './account/account.js';
import { AccountMovementQuery, AccountMovementMutation } from './account/accountMovement.js';
import { ExamResultQuery, ExamResultMutation } from './exam/examResult.js';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...AccountQuery,
  ...AccountMovementQuery,
  ...ExamResultQuery,
});

schemaComposer.Mutation.addFields({
  ...AccountMutation,
  ...AccountMovementMutation,
  ...ExamResultMutation,
});

// const graphqlSchema = schemaComposer.buildSchema();
export default schemaComposer;
