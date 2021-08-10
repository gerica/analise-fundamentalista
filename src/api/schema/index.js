import { SchemaComposer } from 'graphql-compose';
import { CommonMutation, CommonQuery } from './common.js';
import { FundamentoMutation, FundamentoQuery } from './fundamento.js';
import { PapelMutation, PapelQuery } from './papel.js';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...PapelQuery,
  ...FundamentoQuery,
  ...CommonQuery,
});

schemaComposer.Mutation.addFields({
  ...CommonMutation,
  ...PapelMutation,
  ...FundamentoMutation,
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
