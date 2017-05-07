import Core from '../Core';

/**
 * @class StatusManager
 * @constructor
 */
export default class LocalesManager extends Core.EventDispatcher {
  constructor(locales) {
    super();

    this._locales = locales;

    this.init();
  }

  get locales() {
    return this._locales;
  }

  set locales(l) {
    this._locales = l;
    this.dispatchEvent({
      type: 'localesChange',
    });
  }

  update(locales) {
    this._locales.inherit(locales);
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.on('localesChange', this.onLocalesChange.bind(this));
  }

  onLocalesChange(e) {
    this.dispatchEvent({
      type: 'localesChanged',
    }.inherit(true, this.toJS()));
  }

  toJS() {
    return {
      locales: this._locales,
    };
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
