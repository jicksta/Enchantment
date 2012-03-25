var _ = require("underscore");

exports.World = function World(player) {
  this.player = player;
  this.zones = [new exports.Zone(this)];
  this.attackers = [];
};

exports.World.prototype = {
  addAttacker:function(attacker) {
    this.attackers.push(attacker);
  },
  tick: function() {
    _.each(this.attackers, function(attacker) {
      attacker.target.hp -= attacker.attackDamage();
    });
  }
};

exports.Mob = function Mob(name) {
  this.name = name;
  this.hp = 25;
};

exports.Zone = function Zone(world) {
  this.orc = new exports.Mob("an orc");
  this.world = world;
};

exports.Player = function Player(world) {
  this.weapon = {damage:10};
  this.world = world;
};

exports.Player.prototype = {
  attackDamage: function() {
    return this.weapon.damage;
  },
  attack: function(target) {
    this.target = target;
    this.world.addAttacker(this);
  }
};
// repl = require("repl").start("RetroQuest>");
// repl.context.world = new Zone;
