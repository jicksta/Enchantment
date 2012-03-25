var _ = require("underscore");

var Engine = {
  World: require("./world.js").World,
  Player: require("./player.js").Player,
  Zone: require("./zone.js").Zone,
  Mob: require("./mob.js").Mob
};

_.extend(exports, Engine);
