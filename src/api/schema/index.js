import { SchemaComposer } from 'graphql-compose';
import CommonService from '../services/commonService.js';
import PapelService from '../services/papelService.js';

const schemaComposer = new SchemaComposer();
const commonService = new CommonService();
const papelService = new PapelService();

schemaComposer.Query.addFields({
  ...papelService.query,
  ...commonService.query,
});

schemaComposer.Mutation.addFields({
  ...papelService.mutation,
  ...commonService.mutation,
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
