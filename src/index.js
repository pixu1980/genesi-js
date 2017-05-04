import release from '../release';

const status = {
  initialized: true,
  version: release.version,
  build: release.build,
};

console.log('GenesiJS initialized', status);

const genesi = {
  status,
};

export default genesi;
