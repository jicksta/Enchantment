describe("GmCalculator", function() {

  var GmCalculator = require("../src/gm_calculator.js").GmCalculator;

  var calc, player;
  beforeEach(function() {
    player = createWarriorPlayer();
    calc = new GmCalculator(world);
  });

  describe("calculating base stats", function() {

    it("should combine the baseHP of the race", function() {
      calc.extendWithStats(player, "human", "warrior", 1);
      expect(player.baseHP).toEqual(world.config.races.human.baseHP);
    });

  });

  describe("class-specific stats", function() {
    it("should give a baseMana of -1 for a non-magical class", function() {
      calc.extendWithStats(player, "human", "warrior", 1);
      expect(player.baseMana).toEqual(-1);
    });

    it("should combine the baseMana of the race and the manaBonus of the class", function() {
      calc.extendWithStats(player, "human", "caster", 1);
      expect(player.baseMana).toEqual(world.config.races.human.baseMana);
    });
  });

});
