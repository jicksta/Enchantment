(function() {
  exports.GmCalculator = function(config) {
    this.config = config;
  };
  var proto = exports.GmCalculator.prototype;

  proto.baseStats = function(params) {
    var klass = this.config.classes[params.class];
    var race = this.config.races[params.race];

    return {
      baseHP: race.baseHP,
      baseMana: klass.hasMana ? race.baseMana : -1
    };
  };

})();
