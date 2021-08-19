/* eslint-disable no-param-reassign */
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'pino') {
        pkg.peerDependencies = pkg.peerDependencies || {};
        pkg.peerDependencies['pino-pretty'] = '*';
      }
      return pkg;
    },
  },
};
