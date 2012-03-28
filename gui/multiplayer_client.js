$(function() {

  var MAP_WIDTH = 1000,
      MAP_HEIGHT = 500,
      GRID_SIZE = 10;

  var map = Raphael("map", MAP_WIDTH, MAP_HEIGHT);
  var mapOffset = $("#map").offset();

  var player;
  var otherPlayers = {},
      playerElements = {};

  var socket = io.connect("http://localhost");

  socket.on("world", function(world) {
    otherPlayers = $.each(world, function(p) {
      otherPlayers[p.id] = p;
    });

    console.log(world);
    player = createPlayer();
    socket.emit("create", player);

    drawWorld(world);
    drawPlayer(player);
    bindInteraction();
  });

  socket.on("update", function(playerData) {
    $.extend(otherPlayers[playerData.id], playerData);
    drawPlayer(playerData);
  });

  function drawGrid() {
    map.rect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    for (var i = 0; i < MAP_WIDTH; i += GRID_SIZE) {
      map.path(Raphael.format("M{0} 0L{0} {1}", i, MAP_HEIGHT)).attr({stroke:"#ccc"});
    }
    for (var i = 0; i < MAP_HEIGHT; i += GRID_SIZE) {
      map.path(Raphael.format("M0 {0}L{1} {0}", i, MAP_WIDTH)).attr({stroke:"#ccc"});
    }
  }

  function createPlayer() {
    return {
      id:Math.random(),
      x:random(MAP_WIDTH),
      y:random(MAP_HEIGHT),
      color:Raphael.rgb(random(255), random(255), random(255))
    }
  }

  function drawPlayer(player) {
    if (player.id in playerElements) {
      playerElements[player.id].remove();
    }
    playerElements[player.id] = map.circle(player.x, player.y, 10).attr({fill:player.color});
  }

  function bindInteraction() {
    $("#map").mousemove(function(e) {
      updateEvent(e);
    });
    function updateEvent(e) {
      player.x = e.pageX - mapOffset.left;
      player.y = e.pageY - mapOffset.top;
      drawPlayer(player);
      socket.emit("update", player);
    }
  }

  function drawWorld() {
    drawGrid();
    $.each(otherPlayers, function(id, player) {
      drawPlayer(player);
    });
  }

  function random(n) {
    return Math.random() * random
  }

});
