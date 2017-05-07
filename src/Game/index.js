import { Draw, Sound, Elements } from 'evolve-js';

import Core from '../Core';
import Constants from '../Constants';
import Managers from '../Managers';

// import Preload from './Preload';
// import GameElement from './Game/GameElement';
// import Editor from './Game/Editor/Editor';
// import ModalController from './Game/Modals/ModalController';

const $ = window.$;

/**
 * Game is the main class of creatine, it contains and initializes all 
 * systems for your games. It receives two parameters, a configuration 
 * object or an url for a JSON file, and an object containing state 
 * functions.
 *
 * Please consult {{#crossLinkModule 'creatine'}}this page
 * {{/crossLinkModule}} for an overview of these parameters and the usage
 * examples.
 *
 * @class Game
 * @public
 * @param {Object} [config] Configuration data or path for JSON.
 * @param {Object} [state]  State functions.
 */
export default class Game extends Core.EventDispatcher {
  /**
   * Init the world, create main loader promise.
   * @memberOf Game
   * @method constructor
   * @instance
   * @return {Promise.<TResult>}
   */
  constructor(config, state) {
    super();

    let _uniqueID = 0;

    /**
     * Generates a new sequential identifier, starting from `1`.
     *
     * @class newId
     * @constructor
     * @returns A sequential integer.
     */
    this.getNewID = () => {
      return ++_uniqueID;
    };

    return this.init(config, state);
  }

  /**
   * Validate the configuration object provided by the user. It merges the 
   * argument with the default options if necessary.
   * 
   * @method _initializeConfig
   * @param {Object} [config] The configuration object.
   * @return {Object} The configuration object.
   * @private
   */
  initConfig(config) {
    return new Promise((resolve, reject) => {
      try {
        Game.CONFIG = {}.inherit(Constants.DEFAULT_CONFIG, config, {
          environment: {
            canvas: {
              width: (!Number.isNumber(Game.CONFIG.environment.canvas.width) ? Constants.DEFAULT_CONFIG.environment.canvas.width : Game.CONFIG.environment.canvas.width),
              height: (!Number.isNumber(Game.CONFIG.environment.canvas.height) ? Constants.DEFAULT_CONFIG.environment.canvas.height : Game.CONFIG.environment.canvas.height),
            },
            ticker: {
              FPS: (!Number.isNumber(Game.CONFIG.environment.ticker.FPS) ? Constants.DEFAULT_CONFIG.environment.ticker.FPS : Game.CONFIG.environment.ticker.FPS),
            },
          },
        });

        resolve(Game.CONFIG);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * initializes shared data of the game world
   * @memberOf Game
   * @method initShared
   * @instance
   */
  initShared() {
    return new Promise((resolve, reject) => {
      try {
        Game.SHARED.inherit({
          scale: Math.min(window.innerWidth / Game.CONFIG.environment.canvas.width, window.innerHeight / Game.CONFIG.environment.canvas.height),
          canvas: {
            w: Game.CONFIG.environment.canvas.width,
            h: Game.CONFIG.environment.canvas.height,
          },
        });

        Game.SHARED.inherit({
          canvas: {
            scaledW: Game.SHARED.canvas.w * Game.SHARED.scale,
            scaledH: Game.SHARED.canvas.h * Game.SHARED.scale,
          },
        });

        resolve(Game.SHARED);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @todo
   * @memberOf Game
   * @method initCanvas
   * @instance
   */
  initCanvas() {
    return new Promise((resolve, reject) => {
      try {
        this.$canvas = $(Game.CONFIG.environment.canvas.selector);
        this.canvas = this.$canvas[0];

        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.canvas.width = Game.CONFIG.environment.ar.width;
          this.canvas.height = Game.CONFIG.environment.ar.height;
          this.canvas.setAttribute('tabindex', '0');
          this.canvas.addEventListener('mousedown', this.canvas.focus, false);

          //TODO: manage canvas target parent and append canvas to it
        }

        Game.CANVAS = this.canvas;

        //TODO: manage renderers
        //this.renderer = new window.Renderer2DMtx(this.stage, this.canvas);
        //this.rendererSurface = this.renderer.getSurface(Game.CONFIG.environment.canvas.w, Game.CONFIG.environment.canvas.h);
        //this.canvas.parentNode.replaceChild(this.rendererSurface, this.canvas);

        resolve(Game.CANVAS);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @todo
   * @memberOf Game
   * @method initStage
   * @instance
   */
  initStage() {
    return new Promise((resolve, reject) => {
      try {
        this.stage = new Draw.Stage(this.canvas);
        this.stage.updateViewport(Game.SHARED.canvas.w, Game.SHARED.canvas.h);
        this.stage.snapToPixelEnabled = true;
        this.stage.enableMouseOver();
        Core.Touch.enable(this.stage);

        Game.STAGE = this.stageContainer = new Elements.Element({
          parent: this.stage,
          position: {
            x: Game.SHARED.canvas.w * 0.5,
            y: Game.SHARED.canvas.h * 0.5,
          },
          size: {
            width: Game.SHARED.canvas.w,
            height: Game.SHARED.canvas.h,
          },
          fill: 'transparent',
        });

        resolve(Game.STAGE);
      } catch (error) {
        reject(error);
      }
    });
  }

  initSounds() {
    return new Promise((resolve, reject) => {
      try {
        Sound.Sound.initializeDefaultPlugins();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @todo
   * @memberOf Game
   * @method initTicker
   * @instance
   */
  initTicker() {
    return new Promise((resolve, reject) => {
      try {
        Game.TICKER = new Managers.TickerManager(Game.CONFIG.environment.ticker);
        Game.TICKER.on('ticker', this.onTick.bind(this));

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initiliazes the game core objects.
   * 
   * @method _initialize
   * @param {Object} [config] The configuration objects.
   * @param {Object} [state]  The state object.
   * @private
   */
  init(config, state) {
    Game.STATUS = new Managers.StatusManager('init', 'warmup');

    return new Promise((resolve, reject) => {
      Game.STATUS.phase = 'config';

      this.initConfig(config).then(() => {
        Game.STATUS.phase = 'shared data';
        return this.initShared();
      }).then(() => {
        Game.STATUS.phase = 'graphics engine';
        return this.initCanvas();
      }).then(() => {
        return this.initStage();
      }).then(() => {
        Game.STATUS.phase = 'sounds engine';
        return this.initSounds();
      }).then(() => {
        Game.STATUS.phase = 'ticker';
        return this.initTicker();
      }).then(() => {
        Game.STATUS.phase = 'events';
        //   this.gameElement = null;
        //   this.onResize();
        return this.bindEvents();
      }).then(() => {
        Game.STATUS.set('preload', 'starting');
        return this.preload();
      }).then(() => {
        Game.STATUS.phase = 'preloaded';
        //TODO: start game?
        //   console.log('Game preloaded');

        //   if (!Game.CONFIG.environment.editor) {
        //     Game.dispatchEvent('startGame');
        //     //Game.MODALS.open('instructions', {mode: 'instructions'});
        //   } else {
        //     Game.EDITOR.onStartGameClick();
        //   }

        //   console.log('Game ready');
        //   Game.STATUS = 'ready';
      }).catch((error) => {
        console.log('Game.init error', error);
      });
    });
  }

  /**
   * The update state of the game, called periodically once the engine finishes
   * the create state. It calls the state function if provided by the user.
   * 
   * @method update
   * @private
   */
  update() {
    return new Promise((resolve, reject) => {
      Game.STATUS.update('update', 'starting');

      // pre update
      this.mouse.preUpdate();
      this.gamepad.preUpdate();
      this.plugins.preUpdate();
      Game.STATUS.phase = 'pre-update';

      // update
      this.director.update();
      this.plugins.update();
      Game.STATUS.phase = 'update';

      // post update
      this.keyboard.postUpdate();
      this.mouse.postUpdate();
      this.gamepad.postUpdate();
      this.plugins.postUpdate();
      Game.STATUS.phase = 'post-update';

      Game.STATUS.phase = 'updated';
    });
  }

  /**
   * The draw state of the game, called periodically once the engine finishes
   * the create state. It calls the state function if provided by the user.
   * 
   * @method draw
   * @private
   */
  draw() {
    Game.STATUS.update('draw', 'starting');

    // pre draw
    this.plugins.preDraw();
    Game.STATUS.phase = 'pre-draw';

    // draw
    this.plugins.draw();
    Game.STATUS.phase = 'draw';

    this.stage.update();

    // post draw
    this.plugins.postDraw();
    Game.STATUS.phase = 'post-draw';

    Game.STATUS.phase = 'drawed';
  }

  checkStatus(options) {
    if (Game.WORLD.isEnded()) {
      Game.dispatchEvent({
        type: 'endGame',
        prize: Game.CONTROLS.getPrize(),
      });
    }
  }

  updateStatus(options) {
    Game.CONTROLS.status = 'animated';
    Game.WORLD.updateStatus(options);
  }

  /**
   * The preload state of the game, called right after the booting and right 
   * before the preloading process. It calls the state function if provided by 
   * the user.
   * 
   * @method _preload
   * @private
   */
  preload() {
    if (this.state.preload) this.state.preload(this);

    // If all items loaded/no item to load and no manifest
    if (this.load.isFinished() && !this.config.resources.manifest) {
      this._create();

      // Loading item or have manifest
    } else {
      this.load.on('complete', this._create, this);
      if (this.config.resources.manifest) {
        this.load.manifest(this.config.resources.manifest);
      }
      this.load.load();
    }
  }


  /**
   * Ticker function - updating stage with each tick.
   * @memberOf Game
   * @method ticker
   * @instance
   */
  onTick() {
    this.stage.update();
  }

  /**
   * onResize handler updates canvas and stage depending on window dimensions.
   * @memberOf Game
   * @method onResize
   * @instance
   */
  onResize() {
    if (!this.canvas) {
      return;
    }

    Game.SHARED.inherit({
      scale: Math.min(window.innerWidth / Game.CONFIG.environment.canvas.width, window.innerHeight / Game.CONFIG.environment.canvas.height),
      canvas: {
        w: Game.CONFIG.environment.canvas.width,
        h: Game.CONFIG.environment.canvas.height,
      },
      cell: {
        w: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols,
        h: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols, // ar square 1:1
      },
    });

    Game.SHARED.inherit({
      canvas: {
        scaledW: Game.SHARED.canvas.w * Game.SHARED.scale,
        scaledH: Game.SHARED.canvas.h * Game.SHARED.scale,
      },
    });

    Elements.Helpers.setBoxSize(this.canvas, Game.SHARED.canvas.scaledW, Game.SHARED.canvas.scaledH, true);

    if (!this.stage) {
      return;
    }

    Elements.Helpers.scale(this.stage, Game.SHARED.scale);

    this.stage.update();
  }

  /**
   * startGame event handler
   * @memberOf Game
   * @method onStartGame
   * @instance
   */
  onStartGame(options) {
    Game.STATUS = 'started';

    if (!!this.gameElement) {
      Game.STAGE.removeChild(this.gameElement);
      this.gameElement = null;
    }

    Game.CONFIG.inherit({
      game: {
        grid: {
          rows: options.rows,
          cols: options.cols,
        },
        prizes: Game.CONFIG.game.prizes.inherit(options.prizes),
      },
    });

    Game.SHARED.inherit({
      cell: {
        w: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols,
        h: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols, // ar square 1:1
      },
    });


    //return new Promise((resolve) => {
    //  this.INTERACTIVE_AREA.animate();
    //  this.GRID.animateGrid(resolve);
    //});
  }

  /**
   * endGame event handler
   * @memberOf Game
   * @method onEndGame
   * @param options
   * @instance
   */
  onEndGame(options) {
    Game.STATUS = 'ended';
    let mode = 'lose';

    if (options.prize > 0) {
      mode = (options.prize >= 500 ? 'big-win' : 'small-win');
    } else if (options.prize === 'R') {
      mode = 'replay';
    }

    Game.MODALS.open('gameEnd', {
      mode,
      prize: options.prize,
    });
  }

  /**
   * Game world events binder
   * @memberOf Game
   * @method bindEvents
   * @instance
   */
  bindEvents() {
    window.onresize = this.onResize.proxy(this);

    Core.EventDispatcher.initialize(this);

    this.addEventListener('startGame', this.onStartGame.proxy(this));
    this.addEventListener('endGame', this.onEndGame.proxy(this));

    this.addEventListener('checkStatus', this.checkStatus.proxy(this));
    this.addEventListener('updateStatus', this.updateStatus.proxy(this));
    this.addEventListener('updatePrize', this.updatePrize.proxy(this));

    Game.inherit(this);
  }
}

/**
 * CANVAS Object represents canvas
 * @type {HTMLElement}
 */
Game.CANVAS = null;

/**
 * STAGE Object represents stage container
 * @type {Stage}
 */
Game.STAGE = null;

/**
 * WORLD Object represents the game world
 * @type {HTMLElement}
 */
Game.WORLD = null;

/**
 * IMAGES Object for preloaded images
 * @type {Hash}
 */
Game.IMAGES = {};

/**
 * SPRITESHEETS Object for preloaded spritesheets
 * @type {Hash}
 */
Game.SPRITESHEETS = {};

/**
 * SHARED Object represents shared data
 * @type {Hash}
 */
Game.SHARED = {}; //

/**
 * STATUS String represents actual game status
 * @type {String}
 */
Game.STATUS = null;

/**
 * CONFIG Object represents game config
 * @type {Object}
 */
Game.CONFIG = null;
