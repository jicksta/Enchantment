var util = require('util'),
    connect = require('connect'),
    port = 1337;

var STATIC_DIR = __dirname + "/gui/";

// var staticServer = connect.createServer(STATIC_DIR).listen(port);

// util.puts('Listening on ' + port + '...');
// util.puts('Press Ctrl + C to stop.');

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('gui'))
  .use(function(req, res){
    res.end('hello world\n');
  })
 .listen(3000);

var io = require("socket.io").listen(app);

// util.puts("Serving files from " + STATIC_DIR);

io.sockets.on("connection", function(socket) {
  socket.emit("news", {hello: "world"});
  socket.on("my other event", function(data) {
    console.log(data);
  });
});
