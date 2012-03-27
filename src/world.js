var Zone = require("./zone.js").Zone,
    Player = require("./player.js").Player;
var _ = require("underscore");

exports.World = function World() {
  this.zones = [new Zone(this)];
  this.characters = [];
  this.attackers = [];
};

exports.World.prototype = {
  tick: function() {
    _.each(this.attackers, function(attacker) {
      attacker.target.hp -= attacker.attackDamage();
    });
  },
  createCharacter: function() {
    var character = new Player(this);
    this.characters.push(character);
    return character;
  },
  addAttacker:function(attacker) {
    this.attackers.push(attacker);
  }
};
