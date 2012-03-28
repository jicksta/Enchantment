var connect = require('connect'),
    _ = require("underscore"),
    port = 3000;

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('gui'))
    .use(function(req, res) {
      res.end("Couldn't find that.\n");
    })
    .listen(port);

var io = require("socket.io").listen(app);

var game = new Game();

io.sockets.on("connection", function(socket) {
  game.playerConnected(socket);
  socket.on("update", function(player) {
    game.movePlayer(player);
  });
});


function Game() {
  var players = [];
  var playerSockets = {};

  this.playerConnected = function(socket) {
    socket.emit("world", players);
    socket.on("create", function(playerData) {
      game.addPlayer(playerData, socket);
    });
  };

  this.addPlayer = function(playerData, socket) {
    players.push(playerData);
    playerSockets[playerData.id] = socket;
  };

  this.movePlayer = function(playerData) {
    for (var i in players) {
      var thisPlayer = players[i];
      if (thisPlayer.id == playerData.id) {
        _.extend(thisPlayer, playerData);
      } else {
        var thisPlayerSocket = playerSockets[thisPlayer.id];
        thisPlayerSocket.emit("update", playerData);
      }
    }
  }

}
