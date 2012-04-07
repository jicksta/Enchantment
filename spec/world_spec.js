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

    it("should have a GmCalculator .gm property",function() {
      expect(world.gm instanceof GmCalculator).toEqual(true);
    });
  });

});
