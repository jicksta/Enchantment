var _ = require("underscore"),
    colors = require('colors'),
    vm = require("vm");

var Engine = require("./src/engine.js");

var config = Engine.loadConfig("./spec/fixtures/game.yml")
var world = global.world = new Engine.World(config);
world.DEBUG = true;

require("./spec/helpers.js");

var TICK_TIME_MS = 1000;

setupREPL();

function setupREPL() {
  report("Starting Enchantment CLI. Take a look at your " + "world".yellow + " and " + "player".yellow);

  var repl = require("repl").start("Enchantment > ");

  _.extend(repl.context, Engine);

  repl.context.world = world;
  repl.context.player = createWarriorPlayer();

  setInterval(function() {
    world.tick();
  }, TICK_TIME_MS);

  repl.rli.on('close', function() {
    report("\nYou set up camp and fall asleep.".green);
    process.exit();
  });

}

function report(message) {
  console.log(message)
}
