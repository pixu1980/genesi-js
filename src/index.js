import release from '../release';
import constants from './constants';
import helpers from './Helpers';
import classes from './Classes';

const status = {
  initialized: true,
  version: release.version,
  build: release.build,
};

console.log('GenesiJS initialized', status);

const genesi = {
  status,
  constants,
  helpers,
  classes,
};

export default genesi;
