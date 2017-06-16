import { Anim, Draw, Preload, Sound, Elements } from 'evolve-js';

import Core from '../Core';
import Constants from '../Constants';
import Transition from '../Transition';

/**
 * A transition effect to fade-in the new scene.
 *
 * ## Usage example
 *
 *     var game = new tine.Game(null, {
 *       create: function() {
 *         var transition = new tine.transitions.FadeIn(null, 1000);
 *         game.replace(new MyScene(), transition);
 *       }
 *     });
 *
 * @class MoveIn
 * @constructor
 * @param {Function} [ease=createjs.Ease.linear] An easing function from 
 *                   `createjs.Ease` (provided by TweenJS).
 * @param {Number} [duration=400] The transition time in milliseconds.
**/
export default class MoveIn extends Transition {
  constructor(options = { ease: Anim.Ease.linear, duration: 400, direction: 'top left' }) {
    super(options);
  }

  init() {
    super.init();

    if (this.valid) {
      this.directions = this._settings.direction.split(' ');
    }
  }


  startTransition() {
    return new Promise((resolve, reject) => {
      this.endPosition = this.startPosition = {
        x: this.in.x,
        y: this.in.y,
      };

      if(Constants.HORIZONTAL_MODES.contains(this.directions)) {
        if(this.directions.contains(Constants.LEFT)) {
          this.startPosition.x = -this.parentBounds.width;
        } else if(this.directions.contains(Constants.RIGHT)) {
          this.startPosition.x = this.parentBounds.width;
        }
      }

      if(Constants.VERTICAL_MODES.contains(this.directions)) {
        if(this.directions.contains(Constants.TOP)) {
          this.startPosition.y = -this.parentBounds.height;
        } else if(this.directions.contains(Constants.BOTTOM)) {
          this.startPosition.y = this.parentBounds.height;
        }
      }

      this.in.inherit(this.startPosition).animate({ override: true }, this.endPosition, this.duration, this.ease).then(() => {
        resolve();
      });
    });
  }

  endTransition() {
    return new Promise((resolve, reject) => {
      this.in.inherit(this.endPosition);

      resolve();
    });
  }
}
