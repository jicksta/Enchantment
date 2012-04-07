var Fighter = require("./fighter.js").Fighter,
    _ = require("underscore");

exports.Player = function Player(world, params) {
  this.world = world;
  this.id = Math.random().toString();
  this.state = this.DEFAULT_STATE;
  this.killCount = 0;

  _.extend(this, params);

  this.baseHP = this.hp = 100; // TODO: Get rid of this.
  this.target = null;
  this.weapon = {damage: 10};
};

var proto = exports.Player.prototype = new Fighter;

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
  return "Player";
};

proto.toString = function() {
  return this.id;
};
