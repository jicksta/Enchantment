(function() {

  var _ = require("underscore");

  exports.IdSet = function(idAttribute) {
    this.idAttribute = idAttribute || "id";
    this._set = {};
    this.length = 0;
  };

  var proto = exports.IdSet.prototype;

  proto.has = function(obj) {
    var id = obj[this.idAttribute];
    return id in this._set;
  };

  proto.add = function(obj) {
    var id = obj[this.idAttribute];
    if(id == null) throw("Objects have have an ID to be added");
    if (!(id in this._set)) this.length++;
    this._set[id] = obj;
  };

  proto.remove = function(obj) {
    var id = obj[this.idAttribute];
    if(id in this._set) this.length--;
    delete this._set[id];
  };

  proto.each = function(iterator) {
    return _.each(this._set, iterator);
  };

  proto.first = function() {
    for(var key in this._set) {
      if(this._set.hasOwnProperty(key)) {
        return this._set[key];
      }
    }
  }

})();
