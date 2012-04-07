// These are mostly functional tests across classes.
describe("Encounters", function() {

  var player, zone, target;
  beforeEach(function() {
    player = createWarriorPlayer();
    zone = world.zones.orczone;
    target = zone.mobs.first();
  });

  // The idle state is the default state.
  describe("the 'idle' state", function() {
    it("should actually have state of 'idle'", function() {
      expect(target.state).toEqual("idle");
    });
  });

  describe("the 'attacking' state", function() {
    it("should become the current state after attacking", function() {
      expect(player.state).not.toEqual("attacking");
      expect(player).not.toBeAttacking();
      player.attack(target);
      expect(player.state).toEqual("attacking");
      expect(player).toBeAttacking();
    });

    describe("while the player has herself selected", function() {
      it("should not do any damage", function() {
        player.attack(target);
        world.tick();
        player.changeTarget(player);
        expect(player).not.toBeAttacking();
      });
    });
  });

  describe("hitting a mob", function() {
    describe("one on one", function() {
      it("should do the damage of the player's weapon each tick", function() {
        var dmg = player.attackDamage();
        expect(dmg).toBeGreaterThan(0);
        var initialHP = target.hp;
        expect(initialHP).toBeGreaterThan(dmg * 2);
        player.attack(target);
        world.tick();
        expect(target.hp).toEqual(initialHP - dmg);
        world.tick();
      });

      it("should cause the mob to target and start attacking the player", function() {
        var initialPlayerHP = player.hp;
        expect(target.target).not.toEqual(player);
        expect(target).not.toBeAttacking();
        player.attack(target);
        world.tick();
        expect(target).toBeAttacking(player);
        world.tick();
        expect(player.hp).toBeLessThan(initialPlayerHP);
      });

    });

    describe("two players on one mob", function() {
      it("should transition aggro to the second player when the first one dies", function() {
        target.hp = target.baseHP += 100;

        player.attack(target);
        world.tick();
        var otherPlayer = createWarriorPlayer();
        otherPlayer.attack(target);
        world.tick();
        expect(target).toBeAlive();
        player.receivesDamage(player.hp);
        world.tick();
        expect(player).toBeDead();
        expect(target).toBeAttacking(otherPlayer);
      });

      it("should transition aggro when one player does more damage than another", function() {
        target.hp = target.baseHP += 100;
        player.hp = player.baseHP += 100;

        player.attack(target);
        world.tick(); // Player damage = 10

        var otherPlayer = createWarriorPlayer();
        otherPlayer.weapon.damage *= 1.9;
        otherPlayer.attack(target);
        world.tick(); // Player damage = 20, otherPlayer = 19

        expect(target.target).toEqual(player);
        world.tick(); // Player damage = 30, otherPlayer = 38

        expect(target.target).toEqual(otherPlayer);
      });

    });
  });

  describe("killing a mob", function() {

    it("should kill the mob when the player exhausts the target's HP", function() {
      kill();
      expect(target.hp).toEqual(0);
      expect(target).toBeDead();
    });

    it("should bring the player back to the 'default' state", function() {
      kill();
      expect(player.state).toEqual(global.rq.Player.prototype.DEFAULT_STATE);
    });

    it("should increase the kill count", function() {
      var initialKillCount = player.killCount;
      kill();
      expect(player.killCount).toEqual(initialKillCount + 1);
    });

    it("should preserve the 'attacking' state if the kill awarded was not the current target", function() {
      var otherPlayer = createWarriorPlayer();

      player.attack(target);
      otherPlayer.attack(target);
      world.tick();
      expect(player).toBeAttacking(target);

      var otherMob = new global.rq.Mob(zone, {class: "warrior", race: "human", level: 1}); // Should be something with same or higher HP as `target`
      player.attack(otherMob);
      expect(player.state).toEqual('attacking');
      expect(otherMob.state).not.toEqual('dead');

      tickWhile(function() {
        return target.state !== "dead"
      }, world);

      expect(player.target).toEqual(otherMob);
      expect(player.state).toEqual('attacking');
    });

    it("removes the killed mob from the zone's list of mobs", function() {
      player.attack(target);
      tickWhile(function() {
        return target.state !== "dead";
      }, world);
      expect(zone.characters.has(target)).toEqual(false);
      expect(zone.mobs.has(target)).toEqual(false);
    });

    function kill() {
      var dmg = player.attackDamage();
      var initialHP = target.hp;
      player.attack(target);
      var ticksNeededToKill = initialHP / dmg + (initialHP % dmg === 0 ? 0 : 1);
      for (var i = 0; i < ticksNeededToKill; i++) {
        world.tick();
      }
    }

  });

  describe("the player dying", function() {
    it("should no longer be in the attackers list", function() {
      player.attack(target);
      world.tick();
      expect(player.id in zone.attackers).toEqual(true);
      player.receivesDamage(player.hp);
      world.tick();
      expect(player).toBeDead();
      expect(player.id in zone.attackers).toEqual(false);
    });
  });

});
