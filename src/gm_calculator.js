// GM stands for "Game Master".

(function() {

  var _ = require("underscore");

  exports.GmCalculator = function(world) {
    this.world = world;
  };

  var proto = exports.GmCalculator.prototype;

  proto.extendWithStats = function(obj, raceName, className, level) {
    var race = this.world.config.races[raceName];
    var klass = this.world.config.classes[className];

    _.extend(obj, klass, race);

    obj.baseMana = klass.hasMana ? race.baseMana : -1;
  };

})();
