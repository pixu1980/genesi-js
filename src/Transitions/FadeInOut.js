import { Anim, Draw, Preload, Sound, Elements } from 'evolve-js';

import Core from '../Core';
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
 * @class FadeInOut
 * @constructor
 * @param {Function} [ease=createjs.Ease.linear] An easing function from 
 *                   `createjs.Ease` (provided by TweenJS).
 * @param {Number} [duration=400] The transition time in milliseconds.
**/
export default class FadeInOut extends Transition {
  startTransition(resolve) {
    return new Promise((resolve, reject) => {
      const halfDuration = this.duration * 0.5;

      this.in.inherit({
        alpha: 0,
      }).animate({ override: true, delay: halfDuration }, { alpha: 1 }, halfDuration, this.ease).then(() => {
        resolve();
      });

      this.out.inherit({
        alpha: 1,
      }).animate({ override: true }, { alpha: 0 }, halfDuration, this.ease);
    });
  }

  endTransition() {
    return new Promise((resolve, reject) => {
      this.in.inherit({
        alpha: 1,
      });

      this.out.inherit({
        alpha: 1,
      });

      resolve();
    });
  }
}
