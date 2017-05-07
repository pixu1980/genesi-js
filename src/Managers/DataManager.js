import Core from '../Core';

export default class DataManager extends Core.EventDispatcher {
  constructor(data = {}) {
    super();

    this._data = data;

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

    this.init();
  }

  get(path) {
    return this._data.path(path);
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
      type: 'dataChange',
      data: this._data,
    });

  }

  init() {
    this.bindEvents();
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

  toJS() {
    return this._data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
