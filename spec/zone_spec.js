describe("Zone", function() {
  var Mob = require("../src/mob.js").Mob,
      Zone = require("../src/zone.js").Zone;

  var zone;
  beforeEach(function() {
    zone = world.zones.orczone;
  });

  describe("initialization", function() {

    describe("loading of players", function() {
      it("should have the player in its list of characters", function() {
        var player = createWarriorPlayer();
        expect(zone.characters.has(player)).toEqual(true);
      });
    });

    describe("loading of mobs", function() {

      it("instantiates a Mob for each mob in the world config", function() {
        expect(zone.mobs.first() instanceof Mob).toEqual(true);
      });

      it("sets up the mobs with their general params", function() {
        var expectedName = world.config.mobs.orc.name;
        expect(expectedName.length).toBeGreaterThan(0);
        expect(zone.mobs.first().name).toEqual(expectedName);
      });

      it("sets the mob's zone", function() {
        expect(zone.mobs.first().zone).toEqual(zone);
      });

      it("has the mob in its list of characters", function() {
        zone.mobs.each(function(mob) {
          expect(zone.characters.has(mob)).toEqual(true);
        });
      });

      it("puts the mobs at their spawnpoint", function() {
        var spawnpoint = world.config.zones.orczone.mobs[0].spawnpoint;
        var mob = zone.mobs.first();
        expect(mob.x).toEqual(spawnpoint.x);
        expect(mob.z).toEqual(spawnpoint.z);
      });

    });

  });

  describe("when a character kills another character", function() {

    it("should remove the victim from the attackers list", function() {
      var survivor = createWarriorPlayer(),
          victim = createWarriorPlayer();

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      expect(victim.id in zone.attackers).toEqual(true);
      zone.characterKilledCharacter(survivor, victim);
      expect(victim.id in zone.attackers).toEqual(false);
    });

    it("should report the death", function() {
      var survivor = createWarriorPlayer(),
          victim = createWarriorPlayer();
      spyOn(world, "report");

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      zone.characterKilledCharacter(survivor, victim);
      expect(world.report).toHaveBeenCalled();
    });
  });

  describe("ticking", function() {
    it("should regenerate players' health the tick after damage has been done", function() {
      var player = createWarriorPlayer();
      var halfHP = player.hp / 2;
      player.receivesDamage(halfHP);
      world.tick();
      expect(player.hp).toEqual(halfHP + player.hpRegenPerTick());
      world.tick();
      expect(player.hp).toBeGreaterThan(halfHP);
    });
  });

  describe("reporting", function() {
    it("should report a message with the world", function() {
      spyOn(world, "report");
      zone.reportDeath(createWarriorPlayer());
      expect(world.report).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

});
