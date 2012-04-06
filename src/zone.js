var Mob = require("./mob.js").Mob,
    _ = require("underscore");

exports.Zone = function Zone(world, zoneName) {
  this.world = world;
  this.zoneName = zoneName;
  this.attackers = {};
  this.mobs = this._loadMobs();
};

var proto = exports.Zone.prototype;

proto.tick = function(n) {
  if(n == null) n = 1;
  for(var i = 0; i < n; i++) {
    _.each(this.attackers, function(attacker) {
      if(attacker.target !== attacker) {
        attacker.target.receivesDamage(attacker.attackDamage(), attacker);
      }
    });

    // After everyone has done all the damage they're going to do, check for deaths.
    for(var id in this.attackers) {
      var attacker = this.attackers[id];
      if (attacker.target.state === "dead") {
        this.fighterKilledFighter(attacker, attacker.target)
      }
      if (attacker.state !== "attacking") {
        delete this.attackers[id];
      }
    }
  }
};

proto.fighterKilledFighter = function(survivor, deceased) {
  delete this.attackers[deceased.id];
  survivor.awardKill(deceased);
};

proto.addAttacker = function(attacker) {
  this.attackers[attacker.id] = attacker;
};

proto._zoneConfig = function() {
  return this.world.config.zones[this.zoneName];
};

proto._loadMobs = function() {
  var self = this;
  return self._zoneConfig().mobs.map(function(mob) {
    var mobType = mob.type;
    var mobParams = self.world.config.mobs[mobType];
    return new Mob(self, mobParams);
  });
};

