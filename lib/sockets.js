var _ = require("underscore");

module.exports = function(server) {
  var io = require("socket.io").listen(server);

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");

    socket.on('changeorder', function (data) {
      var newItems = [];
      for (var i = 0; i < data.serial.length; i++) {
        newItems[i] = global.items[parseInt(data.serial[i])]
      };
      global.items = newItems;
      socket.broadcast.emit('changeorderclients', { serial: global.items } );
    });

    socket.on('changedrag', function (data) {
      global.draggable = {
        top: data.dragdata.top.toString() + "px",
        left: data.dragdata.left.toString() + "px"
      };

      socket.broadcast.emit('changedragclient', global.draggable);
    });
  });

  return io;
};