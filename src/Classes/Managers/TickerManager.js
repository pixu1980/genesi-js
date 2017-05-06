import { Create } from 'evolve-js';

/**
 * The time manager is a helper to handle the createjs global Ticker. It is 
 * created by the game and can be accessed with `game.time`. 
 *
 * The main function of this class is to store the delta time since last 
 * tick. For example:
 *
 *     var game = new tine.Game(null, {
 *       update: function() {
 *         console.log(game.time.delta); // in milliseconds
 *         console.log(game.time.fdelta); // in seconds
 *       }
 *     })
 * 
 * @class TickerManager
 * @constructor
 */
export default class TickerManager extends Create.Easel.EventDispatcher {
  constructor(options) {
    super();

    this.defaults = {
      fps: 30,
      mode: Create.Easel.Ticker.RAF,
    };

    this.settings = this.defaults.inherit(true, options);

    this._fps = this.settings.fps;
    this._mode = this.settings.mode;
    this._delta = 0;

    this.init();
  }

  get fps() {
    return this._fps;
  }

  set fps(value) {
    this._fps = value;
  }

  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
  }

  get delta() {
    return this._delta;
  }

  set delta(value) {
    this._delta = value;
  }

  get deltaSecs() {
    return this._delta / 1000.0;
  }

  init() {
    Create.Easel.Ticker.framerate = this._fps;
    Create.Easel.Ticker.timingMode = this._mode;

    this.bindEvents();
  }

  bindEvents() {
    Create.Easel.Ticker.on('tick', this.onTick.bind(this));
  }

  onTick(e) {
    this._delta = e.delta;

    this.dispatchEvent(e.inherit(true, {type: 'ticker'}, this.toJS()));
  }

  toJS() {
    return {
      fps: this._fps,
      mode: this._mode,
      delta: this._delta,
      deltaSecs: this.deltaSecs,
    };
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
