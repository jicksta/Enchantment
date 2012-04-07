var _ = require("underscore");
exports.Character = function() {}

exports.Character.prototype = {

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

  hitTarget: function() {
    if (this.target !== this) {
      var dmg = this.attackDamage();
      this.target.receivesDamage(dmg, this);
      this.reportDamage(this + " hits " + this.target + " for " + dmg + " points of damage.");
    }
  },

  attackDamage: function() {
    if (this.weapon) {
      return this.weapon.damage;
    } else {
      return 10;
    }
  },

  stopAttacking: function() {
    if (this.state === "attacking") this.state = this.DEFAULT_STATE;
  },

  regenTick: function() {
    this.hp = Math.min(this.hp + this.hpRegenPerTick(), this.baseHP);
  },

  hpRegenPerTick: function() {
    return 1;
  },

  _setupBaseStats: function(params) {
    _.extend(this, params);
    this.world.gm.extendWithStats(this, params.race, params.class, params.level);
  },

  _resetLifeStats: function() {
    this.hp = this.baseHP;
    this.mana = this.baseMana;
  },

  reportDamage: function(message) {
    this.zone.reportDamage(message);
  },

  receivesDamage: NotImplemented,
  awardKill: NotImplemented

};

function NotImplemented() {
  throw("NotImplementedError. Subclasses must override this.");
}
