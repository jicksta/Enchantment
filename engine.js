var _ = require("underscore"),
 repl = require("repl").start("RetroQuest>");

var RQ = function() {}
RQ.prototype = {
  attack: function(target) {
            console.log("You have killed " + target.name + "!");
          }
}

var Zone = function() {
  this.orc = {name: "an orc"}
}
Zone.prototype = new RQ;

repl.context.zone = new Zone;
