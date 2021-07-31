import AccountService from '../../api/services/account/accountService.js';

const accountService = new AccountService();

const query = {
  // example1: () => service.example1(),
  // example2: () => service.example2(),
  // accountAddCredit: (_, { record }) => accountService.addCredit(record),
  // allMsg: () => service.allMsg(),
};
const mutation = {
  accountAddCredit: (_, { record }) => accountService.addCredit(record),
};
export { query, mutation };
