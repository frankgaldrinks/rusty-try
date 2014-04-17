var _ = require("underscore");

module.exports = function(server) {
  var io = require("socket.io").listen(server);

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");

    socket.on('changeorder', function (data) {
      var newItems = [];
      console.log(data.serial);

      for (var i = 0; i < data.serial.length; i++) {
        newItems[i] = global.items[parseInt(data.serial[i])]
      };
      global.items = newItems;
      console.log(global.items);
      io.sockets.emit('changeorderclients', { serial: global.items } );
    });

    socket.on('changedrag', function (data) {
      global.draggable = {
        top: data.dragdata.top.toString() + "px",
        left: data.dragdata.left.toString() + "px"
      };

      socket.broadcast.emit('changedragclient', global.draggable);
    });

    socket.on('removeitem', function (data) {
      var itemIndex = global.items.indexOf(data.item);
      if (itemIndex !== -1) {
        global.items.splice(itemIndex,1);
        io.sockets.emit('changeorderclients', { serial: global.items } );
      }
    });

    socket.on('newitem', function (data) {
      console.log(data.newItem);
      console.log(typeof data.newItem);
      if (data.newItem.trim() !== "") {
        global.items.push(data.newItem);
        io.sockets.emit('changeorderclients', { serial: global.items });
      }
    });

  });

  return io;
};