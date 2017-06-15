import { Anim, Draw, Preload, Sound, Elements } from 'evolve-js';

import Core from '../Core';

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
   * @class Transition
   * @constructor
   * @param {Function} [ease=createjs.Ease.linear] An easing function from 
   *                   `createjs.Ease` (provided by TweenJS).
   * @param {Number} [time=400] The transition time in milliseconds.
  **/
export default class Transition extends Core.EventDispatcher {
  constructor(options = { ease: Anim.Ease.linear, duration: 400 }) {
    this._defaults = {
      in: null,
      out: null,
      ease: Anim.Ease.linear,
      duration: 400,
    };

    this._settings = this._defaults.inherit(true, options);

    this.init();
  }

  init() {
    this.isValid = this._settings.in instanceof Elements.Element && this._settings.out instanceof Elements.Element && this._settings.in.parent === this._settings.out.parent
  }

  /**
   * Initialize the transition (called by the director).
   * @method start
   * @param {Director} director The Director instance.
   * @param {Scene} outScene The active scene.
   * @param {Scene} inScene The incoming scene.
   * @param {Function} callback The callback function called when the 
   *                   transition is done.
   * @protected
  **/
  start(director, outScene, inScene, callback) {
    this.director = director;
    this.outScene = outScene;
    this.inScene = inScene;
    this.callback = callback;

    director._makeTop(inScene, outScene);
    inScene.alpha = 0;

    var self = this;
    createjs.Tween.get(inScene, { override: true })
      .to({ alpha: 1 }, this.time, this.ease)
      .call(function () { self.complete(); })
  }

  /**
   * Finalize the transition (called by the director).
   * @method complete
   * @protected
  **/
  end() {
    createjs.Tween.removeTweens(this.inScene);
    this.director._makeTop(this.inScene, this.outScene)
    this.inScene.alpha = 1;
    this.callback();
  }
}
