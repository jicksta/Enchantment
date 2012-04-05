global.rq = require("../src/engine.js");

var customMatchers = {
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

  toBeAttacking: function(fighter) {
    if(this.actual.state !== "attacking") return false;

    var result = true;

    if(fighter && this.actual.target !== fighter) result = false;

    this.actual = this.actual.inspect();
    return result;
  }
}

beforeEach(function() {
  global.world = new global.rq.World;
  this.addMatchers(customMatchers)
});

