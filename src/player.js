exports.Player = function Player(world) {
  this.target = null;
  this.weapon = {damage:10};
  this.world = world;
  this.state = exports.Player.DEFAULT_STATE;
  this.killCount = 0;
  this.id = Math.random().toString();
};

exports.Player.DEFAULT_STATE = "default";

exports.Player.prototype = {
  attackDamage: function() {
    return this.weapon.damage;
  },

  changeTarget: function(newTarget) {
    this.target = newTarget;
  },

  attack: function(target) {
    if(target) this.changeTarget(target);
    this.state = "attacking";
    this.world.addAttacker(this);
  },

  awardKill: function(victim) {
    this.killCount++;
    if(this.target === victim) {
      this.target = null;
      this.state = exports.Player.DEFAULT_STATE;
    }
  }

};
