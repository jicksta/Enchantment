(function() {

  var _ = require("underscore"),
      Character = require("./character.js").Character,
      PrioritySet = require("./util/priority_set.js").PrioritySet;

  exports.Mob = function Mob(zone, params) {
    this.zone = zone;
    this.world = this.zone.world;
    this.state = "idle";
    this.hateList = new PrioritySet("id");
    this.id = Math.random().toString();

    this._setupBaseStats(params);
    this._resetLifeStats();
  };

  var proto = exports.Mob.prototype = new Character;

  proto.receivesDamage = function(damage, damageSource) {
    this.hp -= damage;

    if(damageSource != null) this.increaseHateFor(damageSource, damage / 10);

    if (this.hp <= 0) {
      this.hp = 0;
      this.state = "dead";
    } else {
      this._checkHateList()
    }
  };

  proto.setPosition = function(x, z) {
    this.x = x;
    this.z = z;
  };

  proto.startPatrol = function () {
    this._patrolStartTime = Date.now();
  };

  proto.patrolPosition = function(time) {
    if(this._patrolStartTime != null) {
      return {
        x: Math.sin(time - this._patrolStartTime),
        z: Math.cos(time - this._patrolStartTime)
      };
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

  proto.isMob = true;

  proto.inspect = function() {
    return "Mob <" + this.name + ">";
  };

  proto.toString = function() {
    return this.name;
  }

})();
