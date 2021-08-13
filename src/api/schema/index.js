import { SchemaComposer } from 'graphql-compose';
import CommonService from '../services/commonService.js';
import PapelService from '../services/papelService.js';
import ParametroService from '../services/parametroService.js';

const schemaComposer = new SchemaComposer();
const commonService = new CommonService();
const papelService = new PapelService();
const parametroService = new ParametroService();

schemaComposer.Query.addFields({
  ...papelService.query,
  ...commonService.query,
  ...parametroService.query,
});

schemaComposer.Mutation.addFields({
  ...papelService.mutation,
  ...commonService.mutation,
  ...parametroService.mutation,
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
