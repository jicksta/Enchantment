(function() {

  var _ = require("underscore"),
      Fighter = require("./fighter.js").Fighter,
      PrioritySet = require("./util/priority_set.js").PrioritySet;

  exports.Mob = function Mob(world, name) {
    this.world = world;
    this.name = name;
    this.hp = 25;
    this.state = "idle";
    this.hateList = new PrioritySet("id");
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
    if(this.hateList.has(damageSource)) {
      var previousHate = this.hateList.priorityOf(damageSource);
      this.hateList.updatePriority(damageSource, previousHate + amount);
    } else {
      this.hateList.add(damageSource, amount);
    }
  };

  proto._checkHateList = function() {
    var mostHated = this.hateList.first();
    if(this.target !== mostHated) this.attack(mostHated);
  };

  proto.isPlayer = false;

  proto.inspect = function() { return "Mob <" + this.name + ">"; }
})();
