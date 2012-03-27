$(function() {
  var socket = io.connect("http://localhost");
  socket.on("news", function(data) {
    $("<li/>").text(JSON.stringify(data)).appendTo("#messages");
    socket.emit("my other event", {my: "data"});
  });
});
