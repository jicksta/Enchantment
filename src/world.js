var Zone = require("./zone.js").Zone;
var _ = require("underscore");

exports.World = function World(player) {
  this.player = player;
  this.zones = [new Zone(this)];
  this.attackers = [];
};

exports.World.prototype = {
  addAttacker:function(attacker) {
    this.attackers.push(attacker);
  },
  tick: function() {
    _.each(this.attackers, function(attacker) {
      attacker.target.hp -= attacker.attackDamage();
    });
  }
};
