var Zone = require("./zone.js").Zone,
    Player = require("./player.js").Player;
var _ = require("underscore");

exports.World = function World(config) {
  this.config = config;
  this.zones = this._loadZones();
  this.characters = [];
};

exports.World.prototype = {

  tick: function() {
    _.invoke(this.zones, "tick");
  },

  createCharacter: function(params) {
    var character = new Player(this, params);
    var startingZoneName = this.config.races[params.race].startingZones[0];
    var zone = this.zones[startingZoneName];
    character.enterZone(zone);
    this.characters.push(character);
    return character;
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
