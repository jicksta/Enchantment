var Zone = require("./zone.js").Zone,
    Player = require("./player.js").Player;
var _ = require("underscore");

exports.World = function World(config) {
  this.config = config;
  this.zones = this._loadZones();
  this.characters = [];
  this.attackers = {};
};

exports.World.prototype = {
  tick: function(n) {
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
  },

  fighterKilledFighter: function(survivor, deceased) {
    delete this.attackers[deceased.id];
    survivor.awardKill(deceased);
  },

  createCharacter: function() {
    var character = new Player(this);
    this.characters.push(character);
    return character;
  },
  addAttacker: function(attacker) {
    this.attackers[attacker.id] = attacker;
  },

  _loadZones: function() {
    var zones = {};
    for(var zoneName in this.config.zones) {
      if(this.config.zones.hasOwnProperty(zoneName)) {
        zones[zoneName] = new Zone(this, zoneName);
      }
    }
    return zones;
  }
};
