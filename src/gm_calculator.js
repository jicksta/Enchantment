// GM stands for "Game Master".

(function() {

  exports.GmCalculator = function(world) {
    this.world = world;
  };

  var proto = exports.GmCalculator.prototype;

  proto.baseStats = function(obj, params) {
    var klass = this.world.config.classes[params.class];
    var race = this.world.config.races[params.race];

    _.extend(obj, params, klass, race);

    obj.baseMana = klass.hasMana ? race.baseMana : -1;
  };

})();
