var _ = require("underscore"),
    GmCalculator = require("./gm_calculator.js").GmCalculator,
    Zone = require("./zone.js").Zone,
    Player = require("./player.js").Player,
    Set = require("./util/id_set.js").IdSet;

exports.World = function World(config) {
  this.config = config;
  this.gm = new GmCalculator(this);
  this.zones = this._loadZones();
  this.players = new Set;
};

exports.World.prototype = {

  tick: function() {
    _.invoke(this.zones, "tick");
  },

  createPlayer: function(params) {
    var player = new Player(this, params);

    var startingZoneName = this.config.races[params.race].startingZone;
    var zone = this.zones[startingZoneName];
    player.enterZone(zone);
    this.players.add(player);
    return player;
  },

  _loadZones: function() {
    var zones = {};
    for(var zoneName in this.config.zones) {
      if(this.config.zones.hasOwnProperty(zoneName)) {
        zones[zoneName] = new Zone(this, zoneName);
      }
    }
    return zones;
  }
};
