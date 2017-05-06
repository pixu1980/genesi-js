import {Create, Elements, Sounds} from 'evolve-js';

import constants from './constants';
import helpers from './Helpers';
import classes from './Classes';

import release from '../release';

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
  Create,
  Elements,
  Sounds,
};

export default genesi;

export {
  Create,
  Elements,
  Sounds,
};
