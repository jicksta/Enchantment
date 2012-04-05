var _ = require("underscore");

var Engine = {
  World: require("./world.js").World,
  Player: require("./player.js").Player,
  Zone: require("./zone.js").Zone,
  Mob: require("./mob.js").Mob,
  PrioritySet: require("./util/priority_set.js").PrioritySet,
  loadConfig: loadConfig
};

_.extend(exports, Engine);

function loadConfig(file) {
  var fs = require("fs");
  var yamlData = fs.readFileSync(file, "utf8");
  return require("yaml").eval(yamlData);
}
