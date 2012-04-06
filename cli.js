var _ = require("underscore"),
    colors = require('colors'),
    vm = require("vm");

var Engine = require("./src/engine.js");

var world = new Engine.World(config);

var TICK_TIME_MS = 6000;

setupREPL();

function setupREPL() {
  report("Starting Enchantment CLI. Take a look at your " + "world".yellow + " and " + "player".yellow);

  var repl = require("repl").start("Enchantment > ");

  _.extend(repl.context, Engine);

  repl.context.world = world;
  repl.context.player = world.createCharacter({race: "human", class: "warrior", level: 1});

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
