describe("World", function() {

  var _ = require("underscore"),
      GmCalculator = require("../src/gm_calculator.js").GmCalculator;

  describe("#createPlayer", function() {
    it("should put the player in its starting zone", function() {
      var player = createWarriorPlayer();
      expect(player.zone.name).toEqual(world.config.races[player.race].startingZone.name);
    });
  });

  describe("loading from a config", function() {
    it("loading of orczone", function() {
      expect(world.zones.orczone).toBeDefined();
      expect(world.zones.orczone.mobs.length).toEqual(1);
      expect(world.zones.orczone.mobs.first().name).toEqual(world.config.mobs.orc.name);
    });

    it("should have a GmCalculator .gm property", function() {
      expect(world.gm instanceof GmCalculator).toEqual(true);
    });
  });

  describe("#report", function() {
    it("should write to console.log if DEBUG = true", function() {
      world.DEBUG = true;
      spyOn(console, "log");
      var message = "Something";
      world.report(message);
      expect(console.log).toHaveBeenCalledWith(message);
    });

    it("should not log to console.log if DEBUG = false", function() {
      expect(world.DEBUG).toEqual(false);
      spyOn(console, "log");
      var message = "Something";
      world.report(message);
      expect(console.log).not.toHaveBeenCalled();
    });
  })

});
