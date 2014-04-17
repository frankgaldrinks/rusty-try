var _ = require("underscore");

module.exports = function(server,db) {
  var io = require("socket.io").listen(server);
  var $data = db.collection('data');

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");

    socket.on('changeorder', function (data) {
      console.log(socket.room);
      $data.findOne({name: socket.room}, function (err, doc) {
        if (err) throw err;
        var newItems = [];
        // console.log(data.serial);

        for (var i = 0; i < data.serial.length; i++) {
          newItems[i] = doc.items[parseInt(data.serial[i])]
        };

        doc.items = newItems;
        $data.findAndModify({name: socket.room}, [], doc, {'new': true} , function (err, updated) {
          console.log(updated.items);
          io.sockets.in(socket.room).emit('changeorderclients', { serial: newItems } );
        });
        
      });
    });

    socket.on('changedrag', function (data) {
      var newdrag = {
        top: data.dragdata.top.toString() + "px",
        left: data.dragdata.left.toString() + "px"
      };
      $data.findAndModify({name: socket.room}, [], {$set: {draggable: newdrag}}, {'new': true} , function (err, updated) {
        io.sockets.in(socket.room).emit('changedragclient', newdrag);
      });
      
    });

    socket.on('removeitem', function (data) {
      $data.findAndModify({name: socket.room}, [], {$pull: {items: data.item}}, {'new': true}, function (err, updated) {
        if (err) throw err;
        console.dir(updated);
        io.sockets.in(socket.room).emit('changeorderclients', { serial: updated.items } );
      });
    });

    socket.on('newitem', function (data, cb) {
      if (data.newItem.trim() !== "") {
        $data.findAndModify({name: socket.room}, [], {$push: {items: data.newItem}}, {'new': true}, function (err, updated) {
          if (err) throw err;
          console.dir(updated);

          io.sockets.in(socket.room).emit('changeorderclients', { serial: updated.items });
        });
      } else {
        cb("You can't set a blank item!");
      }
    });

    socket.on('enterroom', function (room,cb) {
      socket.room = room;
      socket.join(room);
    });
  });

  return io;
};