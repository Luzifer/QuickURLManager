if (typeof QUM == "undefined") { var QUM = {}; }

QUM.datastore = {
  
  // x coordinate
  _LEFT: "left",
  // y coordinate
  _TOP: "top",
  // width
  _WIDTH: "width",
  // height
  _HEIGHT: "height",
  // maximized
  _MAXIMIZED: "maximized",
  
  /*
   * get boolean item
   * @param {String} property name
   */
  getBooleanItem: function( prop ) {
    var item = air.EncryptedLocalStore.getItem(prop);
    if (item) {
      var value = item.readByte(); 
      return value == 1;
    }

    return false;
  },

  /*
   * get string item
   * @param {String} property name
   */
  getItem: function(prop) {
    var value = false;
    var item = air.EncryptedLocalStore.getItem(prop);
    if (item) {
      value = item.readUTFBytes(item.bytesAvailable);
    }

    return value;
  },

  /*
   * set boolean item value
   * @param {String} property name
   * @param {Boolean} property value
   */
  setBooleanItem: function(prop, value) {
    var data = new air.ByteArray();
    data.writeByte( ( value ) ? 1 : 0 );
    air.EncryptedLocalStore.setItem(prop, data);
  },

  /*
   * set string item value
   * @param {String} property name
   * @param {String} property value
   */
  setItem: function(prop,value) {
    var data = new air.ByteArray();
    data.writeUTFBytes(value);
    air.EncryptedLocalStore.setItem(prop,data);
  },

  /*
   * get window position
   * @return {array} position elements array
   */
  getWindowPosition: function() {
    // defaults
    if ( !this.getItem(this._LEFT) )
    {
      return {
        x: 200,
        y: 100,
        width: 400,
        height: 700,
        maximized: false
      };
    }

    return {
      x: Number(this.getItem(this._LEFT)),
      y: Number(this.getItem(this._TOP)),
      width: Number(this.getItem(this._WIDTH)),
      height: Number(this.getItem(this._HEIGHT)),
      maximized: this.getBooleanItem(this._MAXIMIZED)
    }
  },

  /*
   * set window position
   * @param {integer} x coordinate
   * @param {integer} y coordinate
   * @param {integer} width
   * @param {integer} height
   * @param {boolean} maximized state
   */
  setWindowPosition: function( left, top, width, height, maximized ) {
    this.setBooleanItem(this._MAXIMIZED, maximized);

    if ( !maximized ) {
      this.setItem(this._LEFT, left);
      this.setItem(this._TOP, top);
      this.setItem(this._WIDTH, width);
      this.setItem(this._HEIGHT, height);
    }
  },
  
}