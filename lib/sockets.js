var _ = require("underscore");

module.exports = function(server,db) {
  var io = require("socket.io").listen(server);
  var $data = db.collection('data');
  var _id = {_id: "53501c0ff4c3950629a1d74f"};

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");

    socket.on('changeorder', function (data) {
      $data.findOne({}, function (err, doc) {
        if (err) throw err;
        var newItems = [];
        // console.log(data.serial);

        for (var i = 0; i < data.serial.length; i++) {
          newItems[i] = doc.items[parseInt(data.serial[i])]
        };

        doc.items = newItems;
        $data.findAndModify({name: "first"}, [], doc, {'new': true} , function (err, updated) {
          console.log(updated.items);
          io.sockets.emit('changeorderclients', { serial: newItems } );
        });
        
      });
    });

    socket.on('changedrag', function (data) {
      var newdrag = {
        top: data.dragdata.top.toString() + "px",
        left: data.dragdata.left.toString() + "px"
      };

      $data.findAndModify({name: "first"}, [], {$set: {draggable: newdrag}}, {'new': true} , function (err, updated) {
        socket.broadcast.emit('changedragclient', newdrag);
      });
      


    });

    socket.on('removeitem', function (data) {
      
      $data.findAndModify({name: "first"}, [], {$pull: {items: data.item}}, {'new': true}, function (err, updated) {
        if (err) throw err;
        console.dir(updated);

        io.sockets.emit('changeorderclients', { serial: updated.items } );
      });

    });

    socket.on('newitem', function (data) {
      if (data.newItem.trim() !== "") {
        $data.findAndModify({name: "first"}, [], {$push: {items: data.newItem}}, {'new': true}, function (err, updated) {
          if (err) throw err;
          console.dir(updated);

          io.sockets.emit('changeorderclients', { serial: updated.items });
        });
        
      }
    });

  });

  return io;
};