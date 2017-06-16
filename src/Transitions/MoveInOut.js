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
 * @class MoveInOut
 * @constructor
 * @param {Function} [ease=createjs.Ease.linear] An easing function from 
 *                   `createjs.Ease` (provided by TweenJS).
 * @param {Number} [duration=400] The transition time in milliseconds.
**/
export default class MoveInOut extends Transition {
  constructor(options = { ease: Anim.Ease.linear, duration: 400, direction: Constants.LEFT }) {
    super(options);
  }

  init() {
    super.init();

    if (this.valid) {
      this.direction = this._settings.direction;
    }
  }

  startTransitionSwap() {
    // sample fadein transition, OVERRIDE HERE
    if (!(this.idxOut === -1 || this.idxIn === -1 || this.idxOut >= this.idxIn)) {
      this.parent.removeChild(this.out);
      this.parent.addChildAt(this.out, this.idxIn);
    }
  }

  startTransition() {
    return new Promise((resolve, reject) => {
      this.endInPosition = this.startInPosition = {
        x: this.in.x,
        y: this.in.y,
      };

      this.endOutPosition = this.startOutPosition = {
        x: this.out.x,
        y: this.out.y,
      };

      if (this.direction === Constants.TOP) {
        this.startInPosition.y = -this.parentBounds.height;
        this.endOutPosition.y = this.parentBounds.height;
      } else if (this.direction === Constants.RIGHT) {
        this.startInPosition.x = this.parentBounds.width;
        this.endOutPosition.x = -this.parentBounds.width;
      } else if (this.direction === Constants.BOTTOM) {
        this.startInPosition.y = this.parentBounds.height;
        this.endOutPosition.y = -this.parentBounds.height;
      } else if (this.direction === Constants.LEFT) {
        this.startInPosition.x = -this.parentBounds.width;
        this.endOutPosition.x = this.parentBounds.width;
      }

      this.in.inherit(this.startInPosition).animate({ override: true }, this.endInPosition, this.duration, this.ease).then(() => {
        resolve();
      });

      this.out.inherit(this.startOutPosition).animate({ override: true }, this.endOutPosition, this.duration, this.ease);
    });
  }

  endTransition() {
    return new Promise((resolve, reject) => {
      this.in.inherit(this.endInPosition);
      this.out.inherit(this.endOutPosition);

      resolve();
    });
  }
}
