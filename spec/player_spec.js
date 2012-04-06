describe("Player", function() {

  var _ = require("underscore");

  var player, playerParams;
  beforeEach(function() {
    playerParams = {class: "warrior", race: "human", level: 1};
    player = world.createCharacter(playerParams);
  });

  describe("a newly created character", function() {

    it("should have all the properties passed to it as params", function() {
      _.each(playerParams, function(value, key) {
        expect(player[key]).toEqual(value);
      })
    });

    it("should create a character a single weapon with damage", function() {
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
      expect(world.createCharacter({race: "human", class: "warrior", level: 1}).id).toBeDefined();
    });

    it("should have a null target", function() {
      expect(player.target).toBeNull();
    });

    it("should have a kill count of 0", function() {
      expect(player.killCount).toEqual(0);
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

});
