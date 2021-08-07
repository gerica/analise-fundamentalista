import { SchemaComposer } from 'graphql-compose';
import { AccountMovementQuery, AccountMovementMutation } from './account/accountMovement.js';
// import { DeviceMutation } from './device/device.js';
import { ExamResultQuery, ExamResultMutation } from './exam/examResult.js';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...AccountMovementQuery,
  ...ExamResultQuery,
});

schemaComposer.Mutation.addFields({
  ...AccountMovementMutation,
  ...ExamResultMutation,
  // ...DeviceMutation,
});

// const graphqlSchema = schemaComposer.buildSchema();
export default schemaComposer;
