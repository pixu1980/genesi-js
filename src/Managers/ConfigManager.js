import Core from '../Core';

export default class ConfigManager extends Core.EventDispatcher {
  constructor(config = {}) {
    super();

    this._config = config;

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

this.init();
  }

  get(path) {
    return this._config.path(config);
  }

  set(path, value, merge = false) {
    pathFound = this.get(path);
    
    if(pathFound) {
      if(merge) {
      pathFound.inherit(value);
      } else {
        pathFound = value;
      }
    }

    this.dispatchEvent({
      type: 'configChange',
      config: this.toJS(),
    });

  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.on('configChange', this.onConfigChange.bind(this));
  }

  onDataChange(e) {
    console.log('Config Changed ' + e.config);
    this.dispatchEvent({
      type: 'configChanged',
      config: e.config,
    });
  }

  toJS() {
    return this._config;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
