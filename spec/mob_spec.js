describe("Mob", function() {

  var _ = require("underscore"),
      Mob = require("../src/mob.js").Mob;

  var player, zone, mob, playerParams;
  beforeEach(function() {
    playerParams = {race: "human", class: "warrior", level: 1};
    player = world.createCharacter(playerParams);
    zone = world.zones.orczone;
    mob = zone.mobs[0];
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
        mob.hp += 100;
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
        var otherPlayer = world.createCharacter({race: "human", class: "warrior", level: 1});
        player.attack(mob);
        otherPlayer.attack(mob);
        world.tick();
        player.receivesDamage(player.hp, mob);
        world.tick();
        expect(mob).toBeAttacking(otherPlayer);
      });
    });

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
    })
  });

  describe("#isPlayer", function() {
    it("returns false", function() {
      expect(mob.isPlayer).toEqual(false);
    });
  });

});
