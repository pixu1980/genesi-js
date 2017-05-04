export default class Ajax {
  /**
   * Loads a JSON-encoded data from the server using a GET HTTP request.
   *
   * Reference: http://ondrek.me/post/84819614785/how-to-get-json-xml-in-jquery-and-in-vanilla
   * 
   * @class getJSON
   * @constructor
   * @param {String}   url     The URL to which the request is sent.
   * @param {Function} success The callback function that is executed if the 
   *                           request succeeds.
   */
  static getJSON(url, success) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/json');
    xmlhttp.onreadystatechange = () => {
      ready = (xmlhttp.readyState === 4 && xmlhttp.status === 200);
      const data = (ready ? xmlhttp.responseText : false);

      if (data && Function.isFunction(success)) {
        success(JSON.parse(data));
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }
}
