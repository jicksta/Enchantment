var connect = require('connect'),
    _ = require("underscore"),
    port = 3000;

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('gui'))
    .listen(port);

var io = require("socket.io").listen(app);

var game = new Game;

io.sockets.on("connection", function(socket) {
  game.playerConnected(socket);
  socket.on("update", function(player) {
    game.updatePlayer(player);
  });
});


function Game() {
  var self = this;

  var players = {};
  var playerSockets = {};

  this.playerConnected = function(socket) {
    socket.emit("world", players);
    socket.on("create", function(playerData) {
      game.addPlayer(playerData, socket);
      socket.broadcast.emit("entered", playerData);
      socket.on("disconnect", function() {
        self.playerLeft(playerData.id);
      });
    });
  };

  this.addPlayer = function(playerData, socket) {
    players[playerData.id] = playerData;
    playerSockets[playerData.id] = socket;
  };

  this.playerLeft = function(playerID) {
    delete players[playerID];
    delete playerSockets[playerID];
    io.sockets.emit("left", playerID);
  };

  this.updatePlayer = function(playerData) {
    _.extend(players[playerData.id], playerData);
    playerSockets[playerData.id].broadcast.emit("update", playerData);
  }

}
