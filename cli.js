var _ = require("underscore");
var Engine = require("./src/engine.js");

repl = require("repl").start("RetroQuest >");
_.extend(repl.context, Engine);

var world = new Engine.World;
var player = new Engine.Player(world);

repl.context.world = world;
repl.context.player = player;

