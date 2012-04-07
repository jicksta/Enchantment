global.rq = require("../src/engine.js");

require("./helpers.js");

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

beforeEach(function() {
  var config = global.rq.loadConfig(__dirname + "/fixtures/game.yml");
  global.world = new global.rq.World(config);
  this.addMatchers(CustomMatchers);
});
