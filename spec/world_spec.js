describe("World", function() {
  describe("when a fighter kills another fighter", function() {

    it("should remove the victim from the attackers list", function() {
      var survivor = world.createCharacter(),
          victim = world.createCharacter();

      survivor.attack(victim);
      victim.attack(survivor);
      world.tick();

      expect(victim.id in world.attackers).toEqual(true);
      world.fighterKilledFighter(survivor, victim);
      expect(victim.id in world.attackers).toEqual(false);
    });


  });
});
