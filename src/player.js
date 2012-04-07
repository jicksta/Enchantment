var Character = require("./character.js").Character,
    _ = require("underscore");


// "params" must have: class, race and level.
exports.Player = function Player(world, name, params) {
  this.world = world;
  this.id = Math.random().toString();
  this.state = this.DEFAULT_STATE;
  this.killCount = 0;
  this.name = name;

  this.target = null;
  this.weapon = {damage: 10};

  this._setupBaseStats(params);
  this._resetLifeStats();
};

var proto = exports.Player.prototype = new Character;

proto.awardKill = function(victim) {
  this.killCount++;
  if (this.target === victim) {
    this.target = null;
    this.state = this.DEFAULT_STATE;
  }
};

proto.receivesDamage = function(damage) {
  this.hp -= damage;
  if (this.hp <= 0) {
    this.hp = 0;
    this.state = "dead";
  }
};

proto.enterZone = function(zone) {
  this.zone = zone;
  zone.playerEnters(this);
};

proto.isPlayer = true;

proto.inspect = function() {
  return "Player (" + this + ")";
};

proto.toString = function() {
  return this.name;
};
