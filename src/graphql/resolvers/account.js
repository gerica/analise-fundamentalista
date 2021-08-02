import { readFile } from 'fs/promises';

let json;
async function loadInfo() {
  json = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url)));
}

const query = {
  versionCreditService: async () => {
    await loadInfo();
    const { name, version } = json;
    return `${name} - version:${version}`;
  },
};
const mutation = {
  // accountAddCredit: (_, { record }) => accountService.addCredit(record),
};
export { query, mutation };
