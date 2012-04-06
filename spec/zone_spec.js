describe("Zone", function() {
  var Mob = require("../src/mob.js").Mob,
      Zone = require("../src/zone.js").Zone;

  var zone;
  beforeEach(function() {
    zone = world.zones.orczone;
  });

  describe("loading of mobs", function() {

    it("instantiates a Mob for each mob in the world config", function() {
      expect(zone.mobs[0] instanceof Mob).toEqual(true);
    });

    it("sets up the mobs with their general params", function() {
      var expectedName = world.config.mobs.orc.name;
      expect(expectedName.length).toBeGreaterThan(0);
      expect(zone.mobs[0].name).toEqual(expectedName);
    });

    it("sets the mob's zone", function() {
      expect(zone.mobs[0].zone).toEqual(zone);
    });

  });

  describe("when a fighter kills another fighter", function() {

    it("should remove the victim from the attackers list", function() {
      var survivor = world.createCharacter({race: "human", class: "warrior", level: 1}),
          victim = world.createCharacter({race: "human", class: "warrior", level: 1});

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      expect(victim.id in zone.attackers).toEqual(true);
      zone.fighterKilledFighter(survivor, victim);
      expect(victim.id in zone.attackers).toEqual(false);
    });

  });

});
