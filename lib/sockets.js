var _ = require("underscore");

module.exports = function(server,db) {
  var io = require("socket.io").listen(server);
  var $data = db.collection('data');

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");

    socket.on('enterroom', function (room, cb) {
      socket.room = room.toString();
      socket.join(room);
      var roomcount = socket.manager.rooms["/" + socket.room].length;
      io.sockets.in(socket.room).emit('updateusercount', {count: roomcount});
    });

    socket.on('disconnect', function () {
      console.log("disconnected");
      // var oldroom = socket.room;
      // socket.leave(oldroom);
      var roomcount = socket.manager.rooms["/" + socket.room].length - 1;
      io.sockets.in(socket.room).emit('updateusercount', {count: roomcount});
    });

    socket.on('changeorder', function (data) {

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
    //-----------------------------------------------------------------
    //DRAG FUNCTIONS
    //-----------------------------------------------------------------
    socket.on('changedrag', function (data) {
      var newDrag = {
        top: data.top.toString() + "px",
        left: data.left.toString() + "px"
      };
      socket.newDrag = newDrag;
      io.sockets.in(socket.room).emit('changedragclient', socket.newDrag);
    });

    socket.on('stopdrag', function (data) {
      var newDrag = {
        top: data.top.toString() + "px",
        left: data.left.toString() + "px"
      };
      $data.findAndModify({name: socket.room}, [], {$set: {draggable: newDrag}}, {'new': true} , function (err, updated) {
        console.log(socket.remoteAddress + " stopped dragging");
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

    socket.on("changeitemname", function (data, cb) {
      $data.findOne({name: socket.room}, function (err, doc) {
        //if the oldname exists in the document.items
        if (doc.items.indexOf(data.oldName) === -1) {
          cb("The old val does not exist");
        } else {
          //replace the old value with the new value
          doc.items[doc.items.indexOf(data.oldName)] = data.newName;
          console.log(doc.items);
          $data.update({name: socket.room}, {$set: {items: doc.items}}, function (err, updated) {
            if (err) throw err;
            io.sockets.in(socket.room).emit('changeorderclients', { serial: doc.items });
          });
        }
      });
    });

  });

  return io;
};