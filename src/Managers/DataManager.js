import Core from '../Core';
import Game from '../Engine/Game';

export default class DataManager extends Core.EventDispatcher {
  constructor(data = {}) {
    super();

    const scale = Math.min(window.innerWidth / Game.CONFIG.environment.canvas.width, window.innerHeight / Game.CONFIG.environment.canvas.height);

    this._data = {
      scale,
      canvas: {
        width: Game.CONFIG.environment.canvas.width,
        height: Game.CONFIG.environment.canvas.height,
        scaledWidth: Game.CONFIG.environment.canvas.width * Game.SHARED.scale,
        scaledHeight: Game.CONFIG.environment.canvas.height * Game.SHARED.scale,
      },
    }.inherit(data);

    this.init();
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

  set data(l) {
    this._data = l;
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
