describe("World", function() {

  var _ = require("underscore");

  describe("loading from a config", function() {
    it("loading of orczone", function() {
      expect(world.zones.orczone).toBeDefined();
      expect(world.zones.orczone.mobs.length).toEqual(1);
      expect(world.zones.orczone.mobs[0].name).toEqual(world.config.mobs.orc.name);
    });
  });

  describe("when a fighter kills another fighter", function() {

    it("should remove the victim from the attackers list", function() {
      var survivor = world.createCharacter(),
          victim = world.createCharacter();

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      expect(victim.id in world.attackers).toEqual(true);
      world.fighterKilledFighter(survivor, victim);
      expect(victim.id in world.attackers).toEqual(false);
    });


  });
});
