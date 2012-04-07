var Character = require("./character.js").Character,
    _ = require("underscore");

exports.Player = function Player(world, params) {
  this.world = world;
  this.id = Math.random().toString();
  this.state = this.DEFAULT_STATE;
  this.killCount = 0;

  this.target = null;
  this.weapon = {damage: 10};

  var raceParams = this.world.config.races[params.race];
  var classParams = this.world.config.classes[params.class];

  _.extend(this, params, raceParams);
  if(classParams.hpBonus) this.baseHP += classParams.hpBonus;

  this.hp = this.baseHP;
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
  return "Player";
};

proto.toString = function() {
  return this.id;
};
