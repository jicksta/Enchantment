var Mob = require("./mob.js").Mob,
    IdSet = require("./util/id_set.js").IdSet,
    _ = require("underscore");

exports.Zone = function Zone(world, zoneName) {
  this.world = world;
  this.zoneName = zoneName;
  this.attackers = {};
  this.characters = new IdSet;
  this._loadMobs();
};

var proto = exports.Zone.prototype;

proto.tick = function(n) {
  var self = this;
  if (n == null) n = 1;
  for (var i = 0; i < n; i++) {
    tickRegen();
    tickAttacks();
  }

  function tickAttacks() {
    _.each(self.attackers, function(attacker) {
      attacker.hitTarget();
    });

    // After everyone has done all the damage they're going to do, check for deaths.
    for (var id in self.attackers) {
      var attacker = self.attackers[id];
      if (attacker.target.state === "dead") {
        self.characterKilledCharacter(attacker, attacker.target)
      }
      if (attacker.state !== "attacking") {
        delete self.attackers[id];
      }
    }

  }

  function tickRegen() {
    self.characters.each(function(character) {
      character.regenTick();
    });
  }

};

proto.playerEnters = function(player) {
  this.characters.add(player);
};

proto.characterKilledCharacter = function(survivor, deceased) {
  delete this.attackers[deceased.id];
  if(!deceased.isPlayer) this.mobs.remove(deceased);
  this.characters.remove(deceased);
  survivor.awardKill(deceased);
  this.reportDeath(deceased, survivor);
};

proto.addAttacker = function(attacker) {
  this.attackers[attacker.id] = attacker;
};

proto.reportDamage = function(message) {
  this.world.report(message);
};

// Killer is optional
proto.reportDeath = function(deceased, killer) {
  if(killer) {
    this.world.report(killer + " killed " + deceased);
  } else {
    this.world.report(deceased + " died");
  }
};

proto._zoneConfig = function() {
  return this.world.config.zones[this.zoneName];
};

proto._loadMobs = function() {
  var self = this;
  self.mobs = new IdSet;
  _.each(self._zoneConfig().mobs, function(mobReference) {
    var mobType = mobReference.type;
    var mobParams = self.world.config.mobs[mobType];
    var mob = new Mob(self, mobParams);
    var spawnpoint = mobReference.spawnpoint;
    mob.setPosition(spawnpoint.x, spawnpoint.z);
    self.mobs.add(mob);
    self.characters.add(mob);
  });
};

