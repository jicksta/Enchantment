describe("Mob", function() {

  var _ = require("underscore"),
      Mob = require("../src/mob.js").Mob;

  var player, zone, mob;
  beforeEach(function() {
    player = createWarriorPlayer();
    zone = world.zones.orczone;
    mob = zone.mobs.first();
  });

  describe("newly instantiated mob", function() {

    it("should load the params", function() {
      var mobParams = world.config.mobs.orc;
      var mob = new Mob(zone, mobParams);
      _.each(mobParams, function(value, key) {
        expect(mob[key]).toEqual(value);
      });
    });

    it("should have an attack damage", function() {
      expect(mob.attackDamage()).toBeGreaterThan(0);
    });

    it('should have full health, mana and stamina', function() {
      expect(mob.hp).toEqual(mob.baseHP);
      expect(mob.mana).toEqual(mob.baseMana);
      expect(mob.stamina).toEqual(mob.baseStamina);
    });

    it("should have its zone", function() {
      expect(mob.zone).toEqual(world.zones.orczone);
    });

  });

  describe("#attack", function() {

    it("should set the target to be the attacked person", function() {
      mob.attack(player);
      expect(mob.target).toEqual(player);
    });

    it("should set change the mob's state to attacking", function() {
      mob.attack(player);
      expect(mob).toBeAttacking();
    });

    it("should add itself to its zone's attackers list", function() {
      spyOn(zone, "addAttacker");
      mob.attack(player);
      expect(zone.addAttacker).toHaveBeenCalledWith(mob);
    });

    it("should do its attack damage each tick", function() {
      var initialHP = player.hp;
      mob.attack(player);
      world.tick();
      expect(player.hp).toEqual(initialHP - mob.attackDamage());
    });

    describe("when the victim dies", function() {

      beforeEach(function() {
        mob.hp = mob.baseHP += 100;
      });

      it("should remove the victim from its hate list", function() {
        player.attack(mob);
        world.tick(2);
        expect(mob.hateList.has(player)).toEqual(true);
        player.receivesDamage(player.hp, mob);
        world.tick();
        expect(mob.hateList.has(player)).toEqual(false);
      });

      it("should start attacking the next person on the hate list when the first one dies", function() {
        var otherPlayer = createWarriorPlayer();
        player.attack(mob);
        otherPlayer.attack(mob);
        world.tick();
        player.receivesDamage(player.hp, mob);
        world.tick();
        expect(mob).toBeAttacking(otherPlayer);
      });
    });

  });

  describe("#receivesDamage", function() {
    it("should reduce the mob's HP by the damage amount", function() {
      var initialHP = mob.hp;
      mob.receivesDamage(10, player);
      expect(mob.hp).toEqual(initialHP - 10);
    });

    it("should add the attacker to the hate list", function() {
      mob.receivesDamage(10, player);
      expect(mob.hateList.has(player)).toEqual(true);
    });

    it("should work when not called with an attacker", function() { // regression{
      expect(
          function() {
            mob.receivesDamage(10);
          }).not.toThrow();
    });

  });

  describe("#isPlayer", function() {
    it("returns false", function() {
      expect(mob.isPlayer).toEqual(false);
    });
  });

  describe("describe #regenTick", function() {
    it("should regenerate the amount of HP in its hpRegenPerTick property", function() {
      expect(mob.hpRegenPerTick()).toBeGreaterThan(0);
      var initialHP = mob.hp;
      mob.receivesDamage(mob.hpRegenPerTick() * 2);
      mob.regenTick();
      expect(mob.hp).toEqual(initialHP - mob.hpRegenPerTick());
    });
  });

  describe("setPosition", function() {
    it("should set the x and z positions of the mob", function() {
      var x = -2, z = -6;
      mob.setPosition(x, z);
      expect(mob.x).toEqual(x);
      expect(mob.z).toEqual(z);
    });
  });

  describe("patrolPosition", function() {
    it("should return different positions at different times", function() {
      var now = Date.now();
      mob.startPatrol();
      var firstPatrolPosition = mob.patrolPosition(now);
      var subsequentPosition = mob.patrolPosition(now + 1111);
      expect(subsequentPosition.x).not.toEqual(firstPatrolPosition.x);
      expect(subsequentPosition.z).not.toEqual(firstPatrolPosition.z);
    });
  });

});
