(function() {

  var _ = require("underscore"),
      Fighter = require("./fighter.js").Fighter,
      PrioritySet = require("./util/priority_set.js").PrioritySet;

  exports.Mob = function Mob(zone, params) {
    this.zone = zone;
    this.state = "idle";
    this.hateList = new PrioritySet("id");

    _.extend(this, params);

    this.baseHP = 25;
    this.baseMana = 25;
    this.baseStamina = 50;

    this.hp = this.baseHP;
    this.mana = this.baseMana;
    this.stamina = this.baseStamina;
  };

  var proto = exports.Mob.prototype = new Fighter;

  proto.receivesDamage = function(damage, damageSource) {
    this.hp -= damage;

    this.increaseHateFor(damageSource, damage / 10);

    if (this.hp <= 0) {
      this.hp = 0;
      this.state = "dead";
    } else {
      this._checkHateList()
    }
  };

  proto.increaseHateFor = function(damageSource, amount) {
    if (this.hateList.has(damageSource)) {
      var previousHate = this.hateList.priorityOf(damageSource);
      this.hateList.updatePriority(damageSource, previousHate + amount);
    } else {
      this.hateList.add(damageSource, amount);
    }
  };

  proto.awardKill = function(victim) {
    this.hateList.remove(victim);
    this._checkHateList();
  };

  proto._checkHateList = function() {
    var mostHated = this.hateList.first();
    if (this.target !== mostHated) this.attack(mostHated);
  };

  proto.inspect = function() {
    return "Mob <" + this.name + ">";
  }
})();
