describe("Player", function() {

  var player;
  beforeEach(function() {
    player = world.createCharacter();
  });

  describe("default properties", function() {
    it("should have a 'default' state by default", function() {
      expect(global.rq.Player.DEFAULT_STATE).toEqual("default");
      expect(player.state).toEqual("default");
    });

    it("should have an ID", function() {
      expect(world.createCharacter().id).toBeDefined();
    });

    it("should have a null target", function() {
      expect(player.target).toBeNull();
    });

    it("should have a kill count of 0", function() {
      expect(player.killCount).toEqual(0);
    });

  });

  describe("a newly created character", function() {
    it("should create a character a single weapon with damage", function() {
      var character = player;
      expect(character.weapon).toBeDefined();
      expect(character.weapon.damage).toBeGreaterThan(0);
    });

    it("should have the same world as its creator", function() {
      expect(player.world).toEqual(world);
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
      var newTarget = new global.rq.Mob(world, "Fippy Darkpaw");
      player.changeTarget(newTarget);
      expect(player.target).toEqual(newTarget);
    });

    it("should allow targetting oneself", function() {
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
