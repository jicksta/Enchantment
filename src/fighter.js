exports.Fighter = function() {}

exports.Fighter.prototype = {

  changeTarget: function(newTarget) {
    this.target = newTarget;
  },

  attack: function(target) {
    if(target) this.changeTarget(target);
    this.state = "attacking";
    this.world.addAttacker(this);
  },

  attackDamage: function() {
    if(this.weapon) {
      return this.weapon.damage;
    } else {
      return 5;
    }
  }

};
