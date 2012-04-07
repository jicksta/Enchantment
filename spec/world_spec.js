describe("World", function() {

  var _ = require("underscore");

  describe("#createCharacter", function() {
    it("should put the character in its starting zone", function() {
      var character = createWarriorPlayer();
      expect(character.zone.name).toEqual(world.config.races[character.race].startingZones[0].name);
    });
  });

  describe("loading from a config", function() {
    it("loading of orczone", function() {
      expect(world.zones.orczone).toBeDefined();
      expect(world.zones.orczone.mobs.length).toEqual(1);
      expect(world.zones.orczone.mobs.first().name).toEqual(world.config.mobs.orc.name);
    });
  });

});
