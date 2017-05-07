import {Draw, Anim, Preload, Sound, Elements, Components} from 'elements-js';
import Game from './Game';

const ƒ = window.ƒ;

/**
 * constructs the preloader and returns a promise
 * @class Preloader
 * @classdesc the game preload class used for loading content
 * @public
 * @return {Promise}
 */
export default class Preloader {
  constructor() {
    return new Promise((resolve) => {
      this.init(resolve);
    });
  }

  /**
   * sets up game loader. Resolve promise when loading is complete.
   * @memberOf Preloader
   * @method init
   * @instance
   * @param {Function} resolve - resolve function of the constructor Promise
   */
  init(resolve) {
    this.lastProgress = 0;
    this.preloaderQueue = new Preload.LoadQueue();

    this.preloaderQueue.on('fileload', (e) => {
      this.preloaderLogoImage = e.result;
      this.drawElements();
      this.initLoader(resolve);
    }, this);

    this.preloaderQueue.loadFile({
      id: 'images.logoPreload',
      src: 'assets/images/logo-preload.png',
    });
  }

  drawElements() {
    this.loader = new Elements.Element({
      parent: Game.STAGE,
      size: '100%',
      fill: '#ffb221',
      align: 'center middle',
    }).inherit({
      alpha: 0,
    });

    this.logo = new Elements.ImageElement({
      // debug: true,
      parent: this.loader,
      image: this.preloaderLogoImage,
      align: 'center middle',
    });

    this.logo.cache(...this.logo.bounds);

    this.text = new Elements.TextElement({
      // debug: true,
      parent: this.loader,
      text: 'LOADING',
      font: '45px Arial',
      color: '#fff',
      lineHeight: 60,
      align: 'center',
      outline: {
        color: '#000',
        size: 8,
      },
    }).setPosition({
      y: this.logo.getComputedBounds().bottom + 50,
    }, true);

    this.progressBar = new Components.ProgressBar({
      // debug: true,
      parent: this.loader,
      fill: '#f8db00',
      size: {
        width: '70%',
        height: 90,
      },
      padding: 10,
      stroke: {
        size: 4,
        color:'#2b270d',
        radius: [45, 45, 45, 45],
      },
      align: 'center',
    }).setPosition({
      y: this.text.getComputedBounds().bottom + 100,
    }, true);
  }

  /**
   * removes the loader from the game stage and deletes the loader element
   * @memberOf Preloader
   * @method removeLoader
   * @instance
   */
  removeLoader() {
    Game.STAGE.removeChild(this.loader);
    this.loader = null;
  }

  initLoader(resolve) {
    this.loaderQueue = new Preload.LoadQueue(false);

    this.loaderQueue.on('error', this.constructor.handleFileError, this);

    this.loaderQueue.on('fileload', this.constructor.handleFileLoad, this);

    this.loaderQueue.on('progress', this.handleProgress.bind(this), this);

    this.loaderQueue.on('complete', this.handleComplete.bind(this, () => {
      Function.isFunction(resolve) && resolve();
    }));

    this.loaderQueue.loadManifest(Game.CONFIG.assets.images.map((image) => {
      return image.inherit({
        type: 'image',
      });
    }).concat(Game.CONFIG.assets.spritesheets.map((spritesheet) => {
      return spritesheet.inherit({
        type: 'spritesheet',
      });
    })));

    Anim.Tween.get(this.loader).to({
      alpha: 1,
    }, 1000, Anim.Ease.cubicInOut);
  }

  /**
   * handle errors from loader
   * @memberOf Preloader
   * @method handleFileError
   * @static
   * @param {Object} e - the error event args.
   */
  static handleFileError(e) {
    console.warn(`Error: ${e.title}`);
    console.log(e);
  }

  /**
   * pushing loaded object to Game.IMAGES if file is image or to Game.SPRITESHEETS if file is spritesheet
   * @memberOf Preloader
   * @method handleFileLoad
   * @static
   * @param {Object} e - the loaded item event args.
   */
  static handleFileLoad(e) {
    if (e.item.type === 'image') {
      Game.IMAGES[e.item.id] = e.result;
    } else if (e.item.type === 'spritesheet') {
      Game.SPRITESHEETS[e.item.id] = e.result;
    }
  }

  /**
   * handles and shows loading progress
   * @memberOf Preloader
   * @method handleProgress
   * @instance
   */
  handleProgress() {
    if(this.lastProgress < this.loaderQueue.progress) {
      this.progressBar.setProgressPromise(this.loaderQueue.progress);
      this.lastProgress = this.loaderQueue.progress;
    }
  }

  /**
   * fired when loading is complete, removes the loader and executes callback.
   * @memberOf Preloader
   * @method handleComplete
   * @instance
   * @param {Function} cb - callback after preload complete
   */
  handleComplete(cb) {
    this.progressBar.setProgressPromise(1);
    ƒ.delay(() => {
      Anim.Tween.get(this.loader).to({
        alpha: 0,
      }, 1000, Anim.Ease.cubicInOut).call(() => {
        this.removeLoader();
        Function.isFunction(cb) && cb();
      });
    }, 750);
  }

}
