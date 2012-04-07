describe("Zone", function() {
  var Mob = require("../src/mob.js").Mob,
      Zone = require("../src/zone.js").Zone;

  var zone;
  beforeEach(function() {
    zone = world.zones.orczone;
  });

  describe("initialization", function() {

    describe("loading of players", function() {
      it("should have the player in its list of fighters", function() {

      })
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

      it("has the mob in its list of fighters", function() {
        zone.mobs.each(function(mob) {
          expect(zone.fighters.has(mob)).toEqual(true);
        });
      });

    });

  });

  describe("when a fighter kills another fighter", function() {

    it("should remove the victim from the attackers list", function() {
      var survivor = createWarriorPlayer(),
          victim = createWarriorPlayer();

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      expect(victim.id in zone.attackers).toEqual(true);
      zone.fighterKilledFighter(survivor, victim);
      expect(victim.id in zone.attackers).toEqual(false);
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

});
