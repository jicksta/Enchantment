exports.Fighter = function() {}

exports.Fighter.prototype = {

  DEFAULT_STATE: "default",

  isPlayer: false,
  isMob: false,

  changeTarget: function(newTarget) {
    this.target = newTarget;
    if (newTarget === this) this.stopAttacking();
  },

  attack: function(target) {
    if (target) this.changeTarget(target);
    this.state = "attacking";
    this.zone.addAttacker(this);
  },

  attackDamage: function() {
    if (this.weapon) {
      return this.weapon.damage;
    } else {
      return 10;
    }
  },

  stopAttacking: function() {
    if(this.state === "attacking") this.state = this.DEFAULT_STATE;
  },

  regenTick: function() {
    this.hp = Math.min(this.hp + this.hpRegenPerTick(), this.baseHP);
  },

  hpRegenPerTick: function() { return 1; },

  receivesDamage: NotImplemented,
  awardKill: NotImplemented

};

function NotImplemented() {
  throw("NotImplementedError. Subclasses must override this.");
}
