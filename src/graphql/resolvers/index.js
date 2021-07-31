import * as account from './account.js';

export default {
  Query: {
    ...account.query,
  },
  Mutation: {
    ...account.mutation,
  },
};
