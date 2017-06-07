import Core from '../Core';

export default class EnvironmentManager extends Core.EventDispatcher {
  constructor(data = {}, canvas = { width: 1280, height: 720 }) {
    super();

    this._data = {
      canvas,
    }.inherit(data);

    this.update();
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

  update() {
    const scale = Math.min(window.innerWidth / this._data.canvas.width, window.innerHeight / this._data.canvas.height);

    this._data.inherit({
      scale,
      canvas: {
        scaledWidth: this._data.canvas.width * scale,
        scaledHeight: this._data.canvas.height * scale,
      },
    });
  }

  toJS() {
    return this._data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
