var Mob = require("./mob.js").Mob;

exports.Zone = function Zone(world) {
  this.orc = new Mob(world, "an orc");
  this.world = world;
};
