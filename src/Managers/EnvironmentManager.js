import detector from 'detector-js';

import Core from '../Core';

/**
 * Manager used to detect the device support and specification. It is created
 * by the game and can be accessed using `game.device`.
 * 
 * This class is based on phaser Device and System classes.
 * 
 * @class EnvironmentManager
 * @param {object} the data option
 * @param {object} the canvas option
 * @constructor
 */
export default class EnvironmentManager extends Core.EventDispatcher {
  constructor(data = {}, canvas = { width: 1280, height: 720 }) {
    super();

    this._data = detector.inherit(true, {
      canvas,
    }, data);

    this.init();

    // if (!!canvas) {
    // } else {
    //   throw new Core.Exception('Data', 'No game class instance found');
    // }
  }

  get(path) {
    return this._data.path(path, null);
  }

  set(path, value, merge = false) {
    let pathFound = this.get(path);

    if (pathFound) {
      if (merge) {
        pathFound.inherit(value);
      } else {
        pathFound = value;
      }
    }

    this.dispatchEvent({
      type: 'dataChange',
      data: this._data,
    });
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;

    this.dispatchEvent({
      type: 'dataChange',
      data: this._data,
    });
  }

  init() {
    this.updateCanvas();
    this.bindEvents();
  }

  updateCanvas() {
    const scale = Math.min(window.innerWidth / this._data.canvas.width, window.innerHeight / this._data.canvas.height);

    this.set('canvas', {
      scale,
      scaledWidth: this._data.canvas.width * scale,
      scaledHeight: this._data.canvas.height * scale,
    }, true);
  }

  bindEvents() {
    this.on('dataChange', this.onDataChange.bind(this));
  }

  onDataChange(e) {
    console.log('Data Changed ' + e.data);
    this.dispatchEvent({
      type: 'dataChanged',
      data: e.data,
    });
  }

  // _checkDisplay() {
  //   this.width = this.sourceWidth = this.canvas.width;
  //   this.height = this.sourceHeight = this.canvas.height;
  //   this.orientation = 0;
  //   this.scaleUsingCSS = false;

  //   // CHECK ORIENTATION
  //   if (window['orientation']) {
  //     this.orientation = window['orientation'];

  //   } else if (window.outerWidth > window.outerHeight) {
  //     this.orientation = 90;
  //   }

  //   // CHECK FULLSCREEN
  //   var fs = [
  //     'requestFullscreen',
  //     'webkitRequestFullscreen',
  //     'msRequestFullscreen',
  //     'mozRequestFullScreen',
  //   ];

  //   for (var i = 0; i < fs.length; i++) {
  //     if (this.canvas[fs[i]]) {
  //       this._fullscreenRequest = fs[i];
  //       break
  //     }
  //   }

  //   // REGISTER EVENTS
  //   var _this = this;

  //   window.addEventListener('resize', function (event) {
  //     return _this._onResize(event);
  //   }, false);

  //   window.addEventListener('orientationchange', function (event) {
  //     return _this._onOrientation(event);
  //   }, false);

  //   document.addEventListener('webkitfullscreenchange', function (event) {
  //     return _this._onFullscreen(event);
  //   }, false);

  //   document.addEventListener('mozfullscreenchange', function (event) {
  //     return _this._onFullscreen(event);
  //   }, false);

  //   document.addEventListener('fullscreenchange', function (event) {
  //     return _this._onFullscreen(event);
  //   }, false);
  // }

  // /**
  //  * Sets the Image Smoothing property on the given context. Set to false to 
  //  * disable image smoothing. By default browsers have image smoothing 
  //  * enabled, which isn't always what you visually want, especially when 
  //  * using pixel art in a game. Note that this sets the property on the 
  //  * context itself, so that any image drawn to the context will be affected.
  //  * This sets the property across all current browsers but support is patchy
  //  * on earlier browsers, especially on mobile.
  //  *
  //  * @method setSmoothingEnabled
  //  * @param {boolean} value - If set to true it will enable image smoothing, 
  //  *        false will disable it.
  // **/
  // setSmoothingEnabled(value) {
  //   var context = this.canvas.getContext("2d");

  //   context['imageSmoothingEnabled'] = value;
  //   context['mozImageSmoothingEnabled'] = value;
  //   context['oImageSmoothingEnabled'] = value;
  //   context['webkitImageSmoothingEnabled'] = value;
  //   context['msImageSmoothingEnabled'] = value;
  // }

  // /**
  //  * Sets the CSS image-rendering property on the given canvas to be 'crisp' 
  //  * (aka 'optimize contrast on webkit'). Note that if this doesn't given the
  //  * desired result then see the setSmoothingEnabled.
  //  *
  //  * @method setImageRenderingCrisp
  //  * @param {HTMLCanvasElement} canvas The canvas to set image-rendering 
  //  *        crisp on.
  // **/
  // setImageRenderingCrisp() {
  //   var canvas = this.canvas;

  //   canvas.style['image-rendering'] = 'optimizeSpeed';
  //   canvas.style['image-rendering'] = 'crisp-edges';
  //   canvas.style['image-rendering'] = '-moz-crisp-edges';
  //   canvas.style['image-rendering'] = '-webkit-optimize-contrast';
  //   canvas.style['image-rendering'] = 'optimize-contrast';
  //   canvas.style.msInterpolationMode = 'nearest-neighbor';
  // }

  // /**
  //  * Sets the CSS image-rendering property on the given canvas to be 
  //  * 'bicubic' (aka 'auto'). Note that if this doesn't given the desired 
  //  * result then see the setSmoothingEnabled method.
  //  *
  //  * @method setImageRenderingBicubic
  // **/
  // setImageRenderingBicubic() {
  //   var canvas = this.canvas;
  //   canvas.style['image-rendering'] = 'auto';
  //   canvas.style.msInterpolationMode = 'bicubic';
  // }

  // /**
  //  * Sets the user-select property on the canvas style. Can be used to 
  //  * disable default browser selection actions.
  //  *
  //  * @method setUserSelect
  //  * @param {String} value The touch action to set. Defaults to 'none'.
  // **/
  // setUserSelect(value) {
  //   var canvas = this.canvas;

  //   value = value || 'none';
  //   canvas.style['-webkit-touch-callout'] = value;
  //   canvas.style['-webkit-user-select'] = value;
  //   canvas.style['-khtml-user-select'] = value;
  //   canvas.style['-moz-user-select'] = value;
  //   canvas.style['-ms-user-select'] = value;
  //   canvas.style['user-select'] = value;
  //   canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';
  // }

  // /**
  //  * Sets the touch-action property on the canvas style. Can be used to 
  //  * disable default browser touch actions.
  //  *
  //  * @method setTouchAction
  //  * @param {String} value The touch action to set. Defaults to 'none'.
  // **/
  // setTouchAction(value) {
  //   var canvas = this.canvas;

  //   value = value || 'none';
  //   canvas.style.msTouchAction = value;
  //   canvas.style['ms-touch-action'] = value;
  //   canvas.style['touch-action'] = value;
  // }

  // /**
  //  * Sets the background color behind the canvas. This changes the canvas 
  //  * style property.
  //  *
  //  * @method setBackgroundColor
  //  * @param {String} color The color to set. Can be in the format 
  //  *        'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
  // **/
  // setBackgroundColor(color) {
  //   color = color || 'rgb(0,0,0)';
  //   canvas.style.backgroundColor = color;
  // }

  // /**
  //  * Sets the background image behind the canvas. This changes the canvas 
  //  * style property.
  //  *
  //  * @method setBackgroundImage
  //  * @param {String} image The image path.
  // **/
  // setBackgroundImage(image) {
  //   image = image || 'none';
  //   canvas.style.backgroundImage = image;
  // }

  // // ========================================================================
  // //                             ORIENTATION
  // // ========================================================================
  // /**
  //  * Returns true if the browser dimensions match a portrait display.
  //  * @method isPortrait
  //  * @returns {Boolean}
  // **/
  // isPortrait() {
  //   return this.orientation === 0 || this.orientation == 180;
  // }

  // /**
  //  * Returns true if the browser dimensions match a landscape display.
  //  * @method isLandscape
  //  * @returns {Boolean}
  // **/
  // isLandscape() {
  //   return this.orientation === 90 || this.orientation === -90;
  // }

  // // ========================================================================
  // //                              FULLSCREEN
  // // ========================================================================
  // /**
  //  * Returns true if the browser is in full screen mode, otherwise false.
  //  * @method isFullScreen
  //  * @returns {Boolean}
  // **/
  // isFullscreen() {
  //   return (document['fullscreenElement'] ||
  //     document['mozFullScreenElement'] ||
  //     document['webkitFullscreenElement']);
  // }

  // /**
  //  * Tries to enter the browser into full screen mode.
  //  * Please note that this needs to be supported by the web browser and 
  //  * isn't the same thing as setting your game to fill the browser.
  //  * 
  //  * @method startFullscreen
  // **/
  // startFullscreen() {
  //   if (!this._fullscreenRequest || this.isFullscreen()) {
  //     return;
  //   }

  //   this._width = this.width;
  //   this._height = this.height;

  //   if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT']) {
  //     this.canvas[this._fullscreenRequest](Element.ALLOW_KEYBOARD_INPUT);
  //   } else {
  //     this.canvas[this._fullscreenRequest]();
  //   }
  // }

  // /**
  //  * Stops full screen mode if the browser is in it.
  //  * @method stopFullScreen
  // **/
  // stopFullscreen() {
  //   if (!this.isFullscreen()) {
  //     return;
  //   }

  //   if (document.cancelFullScreen) {
  //     document.cancelFullScreen();
  //   } else if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.webkitCancelFullScreen) {
  //     document.webkitCancelFullScreen();
  //   } else if (document.webkitExitFullscreen) {
  //     document.webkitExitFullscreen();
  //   } else if (document.msCancelFullScreen) {
  //     document.msCancelFullScreen();
  //   } else if (document.msExitFullscreen) {
  //     document.msExitFullscreen();
  //   } else if (document.mozCancelFullScreen) {
  //     document.mozCancelFullScreen();
  //   } else if (document.mozExitFullscreen) {
  //     document.mozExitFullscreen();
  //   }
  // }

  // // ========================================================================
  // //                                EVENTS
  // // ========================================================================
  // /**
  //  * The resize change callback.
  //  *
  //  * @method _onResize
  //  * @private
  // **/
  // _onResize(event) {
  //   this.dispatchEvent('resize');
  // }

  // /**
  //  * The orientation change callback.
  //  *
  //  * @method _onOrientation
  //  * @private
  // **/
  // _onOrientation(event) {
  //   this.orientation = window['orientation'];
  //   this.dispatchEvent('orientation');

  //   if (this.isPortrait()) {
  //     this.dispatchEvent('enterportrait');
  //   }
  //   else {
  //     this.dispatchEvent('enterlandscape');
  //   }
  // }

  // /**
  //  * The fullscreen change callback.
  //  * @method _onFullscreen
  //  * @private
  // **/
  // _onFullscreen(event) {
  //   if (this.isFullscreen()) {
  //     this.dispatchEvent('enterfullscreen');
  //   } else {
  //     this.width = this._width;
  //     this.height = this._height;
  //     this.canvas.width = this._width;
  //     this.canvas.height = this._height;
  //     this.dispatchEvent('exitfullscreen');
  //   }
  // }

  toJS() {
    return this._data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
