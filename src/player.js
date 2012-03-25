exports.Player = function Player(world) {
  this.weapon = {damage:10};
  this.world = world;
};

exports.Player.prototype = {
  attackDamage: function() {
    return this.weapon.damage;
  },
  attack: function(target) {
    this.target = target;
    this.world.addAttacker(this);
  }
};
