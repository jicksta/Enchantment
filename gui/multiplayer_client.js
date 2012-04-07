(function(ns) {

  var player;
  ns.otherPlayers = {};

  ns.socket = io.connect("http://" + window.location.host);

  var connected = false;

  ns.socket.on("world", function(world) {
    ns.otherPlayers = world;
    player = createPlayer();
    ns.remotePlayerID = player.id;
    ns.socket.emit("create", player);
    for(var playerID in world) {
      ns.otherPlayerJoined(playerID);
    }
    connected = true;
  });

  ns.socket.on("entered", function(playerData) {
    ns.otherPlayers[playerData.id] = playerData;
    ns.otherPlayerJoined(playerData.id);
  });

  ns.socket.on("update", function(playerData) {
    _.extend(ns.otherPlayers[playerData.id], playerData);
  });

  ns.socket.on("left", function(playerID) {
    delete ns.otherPlayers[playerID];
    ns.otherPlayerLeft(playerID);
  });

  ns.sendUpdate = function(data) {
    if(connected) {
      ns.socket.emit("update", data);
    }
  };

  function createPlayer(location) {
    return _.extend({id: Math.random().toString()}, location);
  }

})(E);
