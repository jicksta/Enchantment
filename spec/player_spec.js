describe("Player", function() {

  var _ = require("underscore");

  var player, playerParams;
  beforeEach(function() {
    player = createWarriorPlayer();
    playerParams = {class: player.class, race: player.race, level: player.level};
  });

  describe("a newly created player", function() {

    it("should have all the properties passed to it as params", function() {
      _.each(playerParams, function(value, key) {
        expect(player[key]).toEqual(value);
      })
    });

    it("should load its base stats from the config", function() {
      expect(player.baseHP).toBeGreaterThan(0);
    });

    it("should create a player with a single weapon with damage", function() {
      expect(player.weapon).toBeDefined();
      expect(player.weapon.damage).toBeGreaterThan(0);
    });

    it("should have the same world as its creator", function() {
      expect(player.world).toEqual(world);
    });

    it("should have a 'default' state by default", function() {
      expect(global.rq.Player.prototype.DEFAULT_STATE).toEqual("default");
      expect(player.state).toEqual("default");
    });

    it("should have an ID", function() {
      expect(createWarriorPlayer().id).toBeDefined();
    });

    it("should have a null target", function() {
      expect(player.target).toBeNull();
    });

    it("should have a kill count of 0", function() {
      expect(player.killCount).toEqual(0);
    });

    it("should have mana of -1 if its does not use mana", function() {
      expect(player.hasMana).toEqual(false);
      expect(player.class).toEqual("warrior");
      expect(player.baseMana).toEqual(-1);
      expect(player.mana).toEqual(-1);
    });

  });

  describe("receiving damage", function() {

    it("should die when receiving damage greater than its HP", function() {
      player.receivesDamage(player.hp * 2);
      expect(player).toBeDead();
    });

    it("should die when receiving damage equal to its HP", function() {
      player.receivesDamage(player.hp);
      expect(player).toBeDead();
    });

  });

  describe("#changeTarget", function() {
    it("should change the target, duh", function() {
      var newTarget = new global.rq.Mob(player.zone, {class: "warrior", race: "human", level: 1});
      player.changeTarget(newTarget);
      expect(player.target).toEqual(newTarget);
    });

    it("should allow targeting oneself", function() {
      player.changeTarget(player);
      expect(player.target).toEqual(player);
    });
  });

  describe("#isPlayer", function() {
    it("returns true", function() {
      expect(player.isPlayer).toEqual(true);
    });
  });

  describe("#enterZone", function() {
    it("should call playerEnters on its zone with itself as the param", function() {
      var zone = {playerEnters: jasmine.createSpy("playerEnters")};
      player.enterZone(zone);
      expect(zone.playerEnters).toHaveBeenCalledWith(player);
    });

    it("should set its zone to be the given zone", function() {
      var zone = {playerEnters: jasmine.createSpy()};
      player.enterZone(zone);
      expect(player.zone).toEqual(zone);
    });
  });


  describe("describe #regenTick", function() {
    it("should regenerate the amount of HP in its hpRegenPerTick property", function() {
      expect(player.hpRegenPerTick()).toBeGreaterThan(0);
      var initialHP = player.hp
      player.receivesDamage(player.hpRegenPerTick() * 2);
      player.regenTick();
      expect(player.hp).toEqual(initialHP - player.hpRegenPerTick());
    });
  });

});
