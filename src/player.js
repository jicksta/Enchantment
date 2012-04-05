var Fighter = require("./fighter.js").Fighter;

exports.Player = function Player(world) {
  this.hp = 100;
  this.target = null;
  this.weapon = {damage: 10};
  this.world = world;
  this.state = exports.Player.DEFAULT_STATE;
  this.killCount = 0;
  this.id = Math.random().toString();
};

exports.Player.DEFAULT_STATE = "default";

var proto = exports.Player.prototype = new Fighter;

proto.awardKill = function(victim) {
  this.killCount++;
  if (this.target === victim) {
    this.target = null;
    this.state = exports.Player.DEFAULT_STATE;
  }
};

proto.receivesDamage = function(damage) {
  this.hp -= damage;
  if (this.hp <= 0) {
    this.hp = 0;
    this.state = "dead";
  }
};

proto.isPlayer = true;

proto.inspect = function() { return "Player"; }
