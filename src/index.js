import {Draw, Anim, Preload, Sound, Elements} from 'evolve-js';

import Core from './Core';
import Constants from './Constants';
import Helpers from './Helpers';
import Managers from './Managers';
import Game from './Game';

import release from '../release';

const status = {
  initialized: true,
  version: release.version,
  build: release.build,
};

console.log('GenesiJS initialized', status);

const genesi = {
  Core,
  Draw,
  Anim,
  Preload,
  Sound,
  Elements,
  Constants,
  Helpers,
  Managers,
  Game,
  status,
};

export default genesi;

export {
  Core,
  Draw,
  Anim,
  Preload,
  Sound,
  Elements,
  Constants,
  Helpers,
  Managers,
  Game,
};
