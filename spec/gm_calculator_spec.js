describe("GmCalculator", function() {

  var GmCalculator = require("../src/gm_calculator.js").GmCalculator;

  var calc, config;
  beforeEach(function() {
    config = global.rq.loadConfig(__dirname + "/fixtures/game.yml");
    calc = new GmCalculator(config);
  });

  describe("calculating base stats", function() {

    it("should combine the baseHP of the race", function() {
      var base = calc.baseStats({race: "human", class: "warrior", level: 1});
      expect(base.baseHP).toEqual(config.races.human.baseHP);
    });

  });

  describe("class-specific stats", function() {
    it("should give a baseMana of -1 for a non-magical class", function() {
      var base = calc.baseStats({race: "human", class: "warrior", level: 1});
      expect(base.baseMana).toEqual(-1);
    });

    it("should combine the baseMana of the race and the manaBonus of the class", function() {
      var base = calc.baseStats({race: "human", class: "caster", level: 1});
      expect(base.baseMana).toEqual(config.races.human.baseMana);
    });
  });

});
