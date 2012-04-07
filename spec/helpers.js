var TestHelpers = {
  createWarriorPlayer: function() {
    return world.createPlayer("Jick", {race: "human", class: "warrior", level: 1});
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

require("underscore").extend(global, TestHelpers);
