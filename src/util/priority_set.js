(function(ns) {

  var _ = require("underscore");

  // Because JavaScript doesn't allow storing an arbitrary key into a hashmap (Object), you must pass the idProperty
  // the PrioritySet will hash.
  ns.PrioritySet = function(idProperty) {
    if (idProperty == null) throw("Must supply an ID property");
    this._prioritiesToObjects = {};
    this._objectsToPriorities = {};
    this._sortedPriorities = [];
    this.idProperty = idProperty;
  };

  var proto = ns.PrioritySet.prototype;

  proto.add = function(obj, priority) {
    var id = obj[this.idProperty];
    if (id == null) throw("No ID property '" + this.idProperty + "' for added object");

    this._objectsToPriorities[id] = priority;

    var newPriority = !(priority in this._prioritiesToObjects);

    var objectsOfPriority = this._prioritiesToObjects[priority] = this._prioritiesToObjects[priority] || {};
    objectsOfPriority[id] = obj;

    if (newPriority) {
      //  This can be optimized with binary-search insertion
      this._sortedPriorities.push(priority);
      this._sortedPriorities = _.sortBy(this._sortedPriorities, _.identity);
    }
  };

  // If there are many objects with the lowest priority, this does not guarantee anything about which of them will be returned.
  proto.first = function() {
    var firstPriority = this._sortedPriorities[this._sortedPriorities.length - 1];
    if (firstPriority != null) {
      var objectsWithPriority = this._prioritiesToObjects[firstPriority];
      for (var objectID in objectsWithPriority) {
        if (objectsWithPriority.hasOwnProperty(objectID)) {
          return objectsWithPriority[objectID];
        }
      }
    }
  };

  proto.has = function(obj) {
    return obj[this.idProperty] in this._objectsToPriorities;
  };

  proto.updatePriority = function(obj, newPriority) {
    if (!this.has(obj)) throw("Object is not in this set!");
    this.remove(obj);
    this.add(obj, newPriority);
  };

  proto.priorityOf = function(obj) {
    return this._objectsToPriorities[obj[this.idProperty]];
  };

  proto.remove = function(obj) {
    if (!this.has(obj)) return;

    var id = obj[this.idProperty];
    var priority = this._objectsToPriorities[id];

    delete this._objectsToPriorities[id];
    var objectsAtPreviousPriority = this._prioritiesToObjects[priority];
    delete objectsAtPreviousPriority[id];
    if (_.isEmpty(objectsAtPreviousPriority)) {
      delete this._prioritiesToObjects[priority];
      this._sortedPriorities = _.without(this._sortedPriorities, priority); // Can be optimized
    }
  }

})(exports);
