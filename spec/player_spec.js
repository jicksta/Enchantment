describe("Player", function() {
  describe("a newly created character", function() {
    it("should create a character a single weapon with damage", function() {
      var character = world.createCharacter();
      expect(character.weapon).toBeDefined();
      expect(character.weapon.damage).toBeGreaterThan(0);
    });

    it("should have the same world as its creator", function() {
      expect(world.createCharacter().world).toEqual(world);
    });
  });
});
