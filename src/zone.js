var Mob = require("./mob.js").Mob,
    _ = require("underscore");

exports.Zone = function Zone(world, zoneName) {
  this.world = world;
  this.zoneName = zoneName;

  this.mobs = this._loadMobs();
};

var proto = exports.Zone.prototype;

proto._zoneConfig = function() {
  return this.world.config.zones[this.zoneName];
};

proto._loadMobs = function() {
  var self = this;
  return self._zoneConfig().mobs.map(function(mob) {
    var mobType = mob.type;
    var mobParams = self.world.config.mobs[mobType];
    return new Mob(self.world, mobParams);
  });
};
