describe("Character behavior", function() {

  function shared(characterFactory) {

    var character;
    beforeEach(function() {
      character = characterFactory();
    });

    describe("#reportDamage", function() {
      it("should call reportDamage on its zone with the same message", function() {
        spyOn(character.zone, "reportDamage");
        var message = "Tim attacks Jim";
        character.reportDamage(message);
        expect(character.zone.reportDamage).toHaveBeenCalledWith(message);
      });
    });

  }

  describe("on Player", function() {
    shared(function() {
      return createWarriorPlayer();
    });
  });

  describe("on Mob", function() {
    shared(function() {
      return world.zones.orczone.mobs.first();
    });
  })
});
