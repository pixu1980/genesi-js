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

    this._data = {
      canvas,
      platform: {
        desktop: false,
        pc: false,
        mac: false,
        iPhone: false,
        iPad: false,
      },
      os: {
        macOS: false,
        linux: false,
        windows: false,
        iOS: false,
        android: false,
        windowsPhone: false,
        chromeOS: false,
      },
      device: {
        vibration: false,
        touch: true,
        mspointer: false,
      },
      display: {
        pixelRatio: 0,
        width: null, // The current canvas width.
        height: null, // The current canvas height.
        sourceWidth: null, // The original canvas width.
        sourceHeight: null, // The original canvas height.
        minWidth: null, // The minimum width of the canvas, used when canvas is resized.
        minHeight: null, // The minimum height of the canvas, used when canvas is resized.
        maxWidth: null, // The maximum width of the canvas, used when canvas is resized.
        maxHeight: null, // The maximum height of the canvas, used when canvas is resized.
        orientation: null, // The orientation of the window.
        scaleUsingCSS: false, // If `true`, the canvas will be resized using the CSS style.
        _fullscreenRequest: null, // The command to call the fullscreen.
        _width: null, // The last width before entering on fullscreen mode.
        _height: null, // The last height before entering on fullscreen mode.
      },
      browser: {
        arora: false,
        chrome: false,
        cocoonJS: false,
        ejecta: false,
        epiphany: false,
        firefox: false,
        ie: false,
        ieVersion: 0,
        midori: false,
        opera: false,
        safari: false,
        safariMobile: false,
        silk: false,
        trident: false, // Set to true if running a Trident version of Internet Explorer (IE11+).
        tridentVersion: 0, // If running in Internet Explorer 11 this will contain the major version
        webApp: false,
      },
      features: {
        canvas: false,
        webGL: false,
        css3D: false,
        file: false,
        fileSystem: false,
        localStorage: false,
        worker: false,
        pointerLock: false,
        typedArrays: false,
        littleEndian: false,
        getUserMedia: false,
        quirksMode: false,
        fullscreen: false,
      },
      audio: {
        audioData: false,
        webAudio: false,
        ogg: false,
        opus: false,
        mp3: false,
        wav: false,
        m4a: false,
        webm: false,
      }
    }.inherit(data);

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
    this.update();

    this._checkAudio();
    this._checkBrowser();
    this._checkCSS3D();
    this._checkDevice();
    this._checkFeatures();
    this._checkOS();
    this._checkFullscreen();
    this._checkDisplay();

    this.bindEvents();
  }

  update() {
    const scale = Math.min(window.innerWidth / this._data.canvas.width, window.innerHeight / this._data.canvas.height);

    this._data.inherit({
      canvas: {
        scale,
        scaledWidth: this._data.canvas.width * scale,
        scaledHeight: this._data.canvas.height * scale,
      },
    });
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


  /**
   * Check which OS is game running on.
   * @method _checkOS
   * @private
   */
  _checkOS() {
    var ua = navigator.userAgent;

    if (/Android/.test(ua)) {
      this.android = true;

    } else if (/CrOS/.test(ua)) {
      this.chromeOS = true;

    } else if (/iP[ao]d|iPhone/i.test(ua)) {
      this.iOS = true;

    } else if (/Linux/.test(ua)) {
      this.linux = true;

    } else if (/Mac OS/.test(ua)) {
      this.macOS = true;

    } else if (/Windows/.test(ua)) {
      this.windows = true;

      if (/Windows Phone/i.test(ua)) {
        this.windowsPhone = true;
      }
    }

    if (this.windows || this.macOS || (this.linux && this.silk === false)) {
      this.desktop = true;
    }

    //  Windows Phone / Table reset
    if (this.windowsPhone || ((/Windows NT/i.test(ua)) && (/Touch/i.test(ua)))) {
      this.desktop = false;
    }
  }

  /**
   * Check HTML5 features of the host environment.
   * @method _checkFeatures
   * @private
   */
  _checkFeatures() {
    try {
      this.localStorage = !!localStorage.getItem;
    } catch (error) {
      this.localStorage = false;
    }

    this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
    this.fileSystem = !!window['requestFileSystem'];
    this.webGL = (function () { try { var canvas = document.createElement('canvas'); return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); } catch (e) { return false; } })();

    if (this.webGL === null || this.webGL === false) {
      this.webGL = false;
    } else {
      this.webGL = true;
    }

    this.worker = !!window['Worker'];

    if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 1)) {
      this.touch = true;
    }

    if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) {
      this.mspointer = true;
    }

    this.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    this.quirksMode = (document.compatMode === 'CSS1Compat') ? false : true;
    this.getUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  /**
   * Check what browser is game running in.
   * @method _checkFeatures
   * @private
   */
  _checkBrowser() {
    var ua = navigator.userAgent;

    if (/Arora/.test(ua)) {
      this.arora = true;

    } else if (/Chrome/.test(ua)) {
      this.chrome = true;

    } else if (/Epiphany/.test(ua)) {
      this.epiphany = true;

    } else if (/Firefox/.test(ua)) {
      this.firefox = true;

    } else if (/Mobile Safari/.test(ua)) {
      this.mobileSafari = true;

    } else if (/MSIE (\d+\.\d+);/.test(ua)) {
      this.ie = true;
      this.ieVersion = parseInt(RegExp.$1, 10);

    } else if (/Midori/.test(ua)) {
      this.midori = true;

    } else if (/Opera/.test(ua)) {
      this.opera = true;

    } else if (/Safari/.test(ua)) {
      this.safari = true;

    } else if (/Silk/.test(ua)) {
      this.silk = true;

    } else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
      this.ie = true;
      this.trident = true;
      this.tridentVersion = parseInt(RegExp.$1, 10);
      this.ieVersion = parseInt(RegExp.$3, 10);
    }

    // WebApp mode in iOS
    if (navigator['standalone']) {
      this.webApp = true;
    }

    if (navigator['isCocoonJS']) {
      this.cocoonJS = true;
    }

    if (typeof window.ejecta !== "undefined") {
      this.ejecta = true;
    }
  }

  /**
   * Check audio support.
   * @method _checkAudio
   * @private
   */
  _checkAudio() {
    this.audioData = !!(window['Audio']);
    this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);
    var audioElement = document.createElement('audio');
    var result = false;

    try {
      if (result = !!audioElement.canPlayType) {
        if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
          this.ogg = true;
        }

        if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
          this.opus = true;
        }

        if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
          this.mp3 = true;
        }

        // Mimetypes accepted:
        //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
        //   bit.ly/iphoneoscodecs
        if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
          this.wav = true;
        }

        if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
          this.m4a = true;
        }

        if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
          this.webm = true;
        }
      }
    } catch (e) {
    }
  }

  /**
   * Check PixelRatio, iOS device, Vibration API, ArrayBuffers and endianess.
   * @method _checkDevice
   * @private
   */
  _checkDevice() {
    this.pixelRatio = window['devicePixelRatio'] || 1;
    this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
    this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
    this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

    if (typeof Int8Array !== 'undefined') {
      this.littleEndian = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
      this.typedArray = true;
    }
    else {
      this.littleEndian = false;
      this.typedArray = false;
    }

    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    if (navigator.vibrate) {
      this.vibration = true;
    }
  }

  /**
   * Check whether the host environment support 3D CSS.
   * @method _checkCSS3D
   * @private
   */
  _checkCSS3D() {
    var el = document.createElement('p');
    var has3d;
    var transforms = {
      'webkitTransform': '-webkit-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform',
      'MozTransform': '-moz-transform',
      'transform': 'transform'
    };

    // Add it to the body to get the computed style.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  /**
   * Checks for support of the Full Screen API.
   * @method _checkFullscreen
   * @private
   */
  _checkFullscreen() {
    var fs = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'msRequestFullscreen',
      'mozRequestFullScreen',
    ];

    for (var i = 0; i < fs.length; i++) {
      if (this._canvas[fs[i]]) {
        this.fullscreen = true;
        break;
      }
    }

    if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT']) {
      this.fullscreenKeyboard = true;
    }
  }

  /**
   * Check whether the host environment can play audio. Return True if the
   * given file type is supported by the browser, otherwise false.
   *
   * @method canPlayAudio
   * @param {String} type - One of 'mp3, 'ogg', 'm4a', 'wav', 'webm'.
   * @return Boolean
   */
  canPlayAudio(type) {
    if (type == 'mp3' && this.mp3) {
      return true;
    } else if (type === 'ogg' && (this.ogg || this.opus)) {
      return true;
    } else if (type === 'm4a' && this.m4a) {
      return true;
    } else if (type === 'wav' && this.wav) {
      return true;
    } else if (type === 'webm' && this.webm) {
      return true;
    }

    return false;
  }

  _checkDisplay() {
    this.width = this.sourceWidth = this.canvas.width;
    this.height = this.sourceHeight = this.canvas.height;
    this.orientation = 0;
    this.scaleUsingCSS = false;

    // CHECK ORIENTATION
    if (window['orientation']) {
      this.orientation = window['orientation'];

    } else if (window.outerWidth > window.outerHeight) {
      this.orientation = 90;
    }

    // CHECK FULLSCREEN
    var fs = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'msRequestFullscreen',
      'mozRequestFullScreen',
    ];

    for (var i = 0; i < fs.length; i++) {
      if (this.canvas[fs[i]]) {
        this._fullscreenRequest = fs[i];
        break
      }
    }

    // REGISTER EVENTS
    var _this = this;

    window.addEventListener('resize', function (event) {
      return _this._onResize(event);
    }, false);

    window.addEventListener('orientationchange', function (event) {
      return _this._onOrientation(event);
    }, false);

    document.addEventListener('webkitfullscreenchange', function (event) {
      return _this._onFullscreen(event);
    }, false);

    document.addEventListener('mozfullscreenchange', function (event) {
      return _this._onFullscreen(event);
    }, false);

    document.addEventListener('fullscreenchange', function (event) {
      return _this._onFullscreen(event);
    }, false);
  }

  /**
   * Sets the Image Smoothing property on the given context. Set to false to 
   * disable image smoothing. By default browsers have image smoothing 
   * enabled, which isn't always what you visually want, especially when 
   * using pixel art in a game. Note that this sets the property on the 
   * context itself, so that any image drawn to the context will be affected.
   * This sets the property across all current browsers but support is patchy
   * on earlier browsers, especially on mobile.
   *
   * @method setSmoothingEnabled
   * @param {boolean} value - If set to true it will enable image smoothing, 
   *        false will disable it.
  **/
  setSmoothingEnabled(value) {
    var context = this.canvas.getContext("2d");

    context['imageSmoothingEnabled'] = value;
    context['mozImageSmoothingEnabled'] = value;
    context['oImageSmoothingEnabled'] = value;
    context['webkitImageSmoothingEnabled'] = value;
    context['msImageSmoothingEnabled'] = value;
  }

  /**
   * Sets the CSS image-rendering property on the given canvas to be 'crisp' 
   * (aka 'optimize contrast on webkit'). Note that if this doesn't given the
   * desired result then see the setSmoothingEnabled.
   *
   * @method setImageRenderingCrisp
   * @param {HTMLCanvasElement} canvas The canvas to set image-rendering 
   *        crisp on.
  **/
  setImageRenderingCrisp() {
    var canvas = this.canvas;

    canvas.style['image-rendering'] = 'optimizeSpeed';
    canvas.style['image-rendering'] = 'crisp-edges';
    canvas.style['image-rendering'] = '-moz-crisp-edges';
    canvas.style['image-rendering'] = '-webkit-optimize-contrast';
    canvas.style['image-rendering'] = 'optimize-contrast';
    canvas.style.msInterpolationMode = 'nearest-neighbor';
  }

  /**
   * Sets the CSS image-rendering property on the given canvas to be 
   * 'bicubic' (aka 'auto'). Note that if this doesn't given the desired 
   * result then see the setSmoothingEnabled method.
   *
   * @method setImageRenderingBicubic
  **/
  setImageRenderingBicubic() {
    var canvas = this.canvas;
    canvas.style['image-rendering'] = 'auto';
    canvas.style.msInterpolationMode = 'bicubic';
  }

  /**
   * Sets the user-select property on the canvas style. Can be used to 
   * disable default browser selection actions.
   *
   * @method setUserSelect
   * @param {String} value The touch action to set. Defaults to 'none'.
  **/
  setUserSelect(value) {
    var canvas = this.canvas;

    value = value || 'none';
    canvas.style['-webkit-touch-callout'] = value;
    canvas.style['-webkit-user-select'] = value;
    canvas.style['-khtml-user-select'] = value;
    canvas.style['-moz-user-select'] = value;
    canvas.style['-ms-user-select'] = value;
    canvas.style['user-select'] = value;
    canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';
  }

  /**
   * Sets the touch-action property on the canvas style. Can be used to 
   * disable default browser touch actions.
   *
   * @method setTouchAction
   * @param {String} value The touch action to set. Defaults to 'none'.
  **/
  setTouchAction(value) {
    var canvas = this.canvas;

    value = value || 'none';
    canvas.style.msTouchAction = value;
    canvas.style['ms-touch-action'] = value;
    canvas.style['touch-action'] = value;
  }

  /**
   * Sets the background color behind the canvas. This changes the canvas 
   * style property.
   *
   * @method setBackgroundColor
   * @param {String} color The color to set. Can be in the format 
   *        'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
  **/
  setBackgroundColor(color) {
    color = color || 'rgb(0,0,0)';
    canvas.style.backgroundColor = color;
  }

  /**
   * Sets the background image behind the canvas. This changes the canvas 
   * style property.
   *
   * @method setBackgroundImage
   * @param {String} image The image path.
  **/
  setBackgroundImage(image) {
    image = image || 'none';
    canvas.style.backgroundImage = image;
  }

  // ========================================================================
  //                             ORIENTATION
  // ========================================================================
  /**
   * Returns true if the browser dimensions match a portrait display.
   * @method isPortrait
   * @returns {Boolean}
  **/
  isPortrait() {
    return this.orientation === 0 || this.orientation == 180;
  }

  /**
   * Returns true if the browser dimensions match a landscape display.
   * @method isLandscape
   * @returns {Boolean}
  **/
  isLandscape() {
    return this.orientation === 90 || this.orientation === -90;
  }

  // ========================================================================
  //                              FULLSCREEN
  // ========================================================================
  /**
   * Returns true if the browser is in full screen mode, otherwise false.
   * @method isFullScreen
   * @returns {Boolean}
  **/
  isFullscreen() {
    return (document['fullscreenElement'] ||
      document['mozFullScreenElement'] ||
      document['webkitFullscreenElement']);
  }

  /**
   * Tries to enter the browser into full screen mode.
   * Please note that this needs to be supported by the web browser and 
   * isn't the same thing as setting your game to fill the browser.
   * 
   * @method startFullscreen
  **/
  startFullscreen() {
    if (!this._fullscreenRequest || this.isFullscreen()) {
      return;
    }

    this._width = this.width;
    this._height = this.height;

    if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT']) {
      this.canvas[this._fullscreenRequest](Element.ALLOW_KEYBOARD_INPUT);
    } else {
      this.canvas[this._fullscreenRequest]();
    }
  }

  /**
   * Stops full screen mode if the browser is in it.
   * @method stopFullScreen
  **/
  stopFullscreen() {
    if (!this.isFullscreen()) {
      return;
    }

    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msCancelFullScreen) {
      document.msCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.mozExitFullscreen) {
      document.mozExitFullscreen();
    }
  }

  // ========================================================================
  //                                EVENTS
  // ========================================================================
  /**
   * The resize change callback.
   *
   * @method _onResize
   * @private
  **/
  _onResize(event) {
    this.dispatchEvent('resize');
  }

  /**
   * The orientation change callback.
   *
   * @method _onOrientation
   * @private
  **/
  _onOrientation(event) {
    this.orientation = window['orientation'];
    this.dispatchEvent('orientation');

    if (this.isPortrait()) {
      this.dispatchEvent('enterportrait');
    }
    else {
      this.dispatchEvent('enterlandscape');
    }
  }

  /**
   * The fullscreen change callback.
   * @method _onFullscreen
   * @private
  **/
  _onFullscreen(event) {
    if (this.isFullscreen()) {
      this.dispatchEvent('enterfullscreen');
    } else {
      this.width = this._width;
      this.height = this._height;
      this.canvas.width = this._width;
      this.canvas.height = this._height;
      this.dispatchEvent('exitfullscreen');
    }
  }

  toJS() {
    return this._data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
