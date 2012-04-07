global.rq = require("../src/engine.js");

var CustomMatchers = {
  toBeDead: function() {
    var result = this.actual.state === "dead";
    this.actual = this.actual.inspect();
    return result;
  },

  toBeAlive: function() {
    var result = this.actual.state !== "dead";
    this.actual = this.actual.inspect();
    return result;
  },

  toBeAttacking: function(character) {
    if(this.actual.state !== "attacking") return false;

    var result = true;

    if(character && this.actual.target !== character) result = false;

    this.actual = this.actual.inspect();
    return result;
  }
};

var TestHelpers = {
  _: require("underscore"),
  createWarriorPlayer: function() {
    return world.createPlayer({race: "human", class: "warrior", level: 1});
  },
  tickWhile: function(expression, tickable, maxTicks) {
    if(maxTicks == null) maxTicks = 100;
    var ticks = 0;
    while(expression()) {
      ticks++;
      if(ticks >= maxTicks) throw("TICKED TOO MANY TIMES (" + ticks + "/" + maxTicks + ")");
      tickable.tick();
    }
  }
};

TestHelpers._.extend(global, TestHelpers);

beforeEach(function() {
  var config = global.rq.loadConfig(__dirname + "/fixtures/game.yml");
  global.world = new global.rq.World(config);
  this.addMatchers(CustomMatchers);
});
