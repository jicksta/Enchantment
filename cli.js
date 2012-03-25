var _ = require("underscore"),
    colors = require('colors');

var Engine = require("./src/engine.js");

var world = new Engine.World;
var player = new Engine.Player(world);

var TICK_TIME_MS = 6000;

setupREPL();

function setupREPL() {
  console.log("Starting RetroQuest CLI. Take a look at your " + "world".yellow + " and " + "player".yellow);

  var repl = require("repl").start("RetroQuest > ");

  _.extend(repl.context, Engine);

  repl.context.world = world;
  repl.context.player = player;

  setInterval(function() {
    world.tick();
  }, TICK_TIME_MS);

  repl.rli.on('close', function() {
    console.log("\nYou set up camp and fall asleep.".green);
    process.exit();
  });

}
