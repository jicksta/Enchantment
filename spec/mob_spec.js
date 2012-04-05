describe("Mob", function() {

  var player, mob;
  beforeEach(function() {
    player = world.createCharacter();
    mob = world.zones[0].orc
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

    it("should add itself to its world's attackers list", function() {
      spyOn(world, "addAttacker");
      mob.attack(player);
      expect(world.addAttacker).toHaveBeenCalledWith(mob);
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
        var otherPlayer = world.createCharacter();
        player.attack(mob);
        otherPlayer.attack(mob);
        world.tick();
        player.receivesDamage(player.hp, mob);
        world.tick();
        expect(mob).toBeAttacking(otherPlayer);
      });
    });

  });

  describe("a newly created mob", function() {
    it("should have an attack damage", function() {
      expect(mob.attackDamage()).toBeGreaterThan(0);
    });
  });

  describe("#isPlayer", function() {
    it("returns false", function() {
      expect(mob.isPlayer).toEqual(false);
    });
  });

});
