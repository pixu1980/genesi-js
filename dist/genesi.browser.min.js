(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * constructs Genesi class
   * @class Genesi
   * @classdesc Genesi description
   * @public
   */
  var Genesi =
  /*#__PURE__*/
  function () {
    function Genesi() {
      _classCallCheck(this, Genesi);

      this.init();
    }
    /**
     * initialize all
     * @memberOf Genesi
     * @method init
     * @instance
     */


    _createClass(Genesi, [{
      key: "init",
      value: function init() {
        console.warn('GenesiJS initialized');
      }
    }]);

    return Genesi;
  }();

  /*global Window*/

  if (typeof module !== 'undefined') {
    module.exports = Genesi;
  }

}());
