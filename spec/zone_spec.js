describe("Zone", function() {
  var Mob = require("../src/mob.js").Mob,
      Zone = require("../src/zone.js").Zone;

  describe("loading of mobs", function() {

    var zone;
    beforeEach(function() {
      zone = new Zone(world, "orczone");
    });

    it("instantiates a Mob for each mob in the world config", function() {
      expect(zone.mobs[0] instanceof Mob).toEqual(true);
    });

    it("sets up the mobs with their general params", function() {
      var expectedName = world.config.mobs.orc.name;
      expect(expectedName.length).toBeGreaterThan(0);
      expect(zone.mobs[0].name).toEqual(expectedName);
    });
  });
});
