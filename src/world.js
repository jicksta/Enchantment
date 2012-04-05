var Zone = require("./zone.js").Zone,
    Player = require("./player.js").Player;
var _ = require("underscore");

exports.World = function World() {
  this.zones = [new Zone(this)];
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
      var playersNoLongerAttacking = [];
      for(var id in this.attackers) {
        var attacker = this.attackers[id];
        if (attacker.isPlayer && attacker.target.state === "dead") {
          attacker.awardKill(attacker.target);
        }
        if (attacker.state !== "attacking") {
          playersNoLongerAttacking.push(id);
        }
      }
      for(var index in playersNoLongerAttacking) {
        delete this.attackers[playersNoLongerAttacking[index]];
      }
    }
  },
  createCharacter: function() {
    var character = new Player(this);
    this.characters.push(character);
    return character;
  },
  addAttacker: function(attacker) {
    this.attackers[attacker.id] = attacker;
  }
};
